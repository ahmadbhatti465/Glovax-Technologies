import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@libsql/client";
import { POST as contactPOST } from "@/app/api/contact/route";
import { POST as leadPOST } from "@/app/api/chat/lead/route";

const db = createClient({ url: process.env.DATABASE_URL! });
let ipCounter = 0;

const post = (route: (r: Request) => Promise<Response>, body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  route(
    new Request("http://localhost/api", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip },
      body: JSON.stringify(body),
    })
  );

const leadCount = async (email: string) =>
  Number((await db.execute({ sql: "select count(*) n from leads where email = ?", args: [email] })).rows[0].n);

const contactBody = (email: string, extra = {}) => ({
  name: "Test Person",
  email,
  service: "web",
  message: "A long enough message for validation.",
  ...extra,
});

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe.each([
  ["contact", contactPOST, contactBody],
  ["chat", leadPOST, (email: string, extra = {}) => ({ email, message: "hello", ...extra })],
] as const)("%s", (_name, route, body) => {
  it("saves a valid submission", async () => {
    const response = await post(route, body(`ok-${_name}@example.com`));
    expect(response.status).toBe(200);
    expect((await response.json()).success).toBe(true);
    expect(await leadCount(`ok-${_name}@example.com`)).toBe(1);
  });

  it("rejects an invalid email without saving", async () => {
    const response = await post(route, body("not-an-email"));
    expect(response.status).toBe(400);
    expect(await leadCount("not-an-email")).toBe(0);
  });

  it("pretends to accept a filled honeypot but saves nothing", async () => {
    const response = await post(route, body(`bot-${_name}@example.com`, { reference_code: "spam" }));
    expect(response.status).toBe(200);
    expect(await leadCount(`bot-${_name}@example.com`)).toBe(0);
  });

  it("allows 5 submissions an hour per IP, then returns 429", async () => {
    const ip = `10.1.0.${++ipCounter}`;
    for (let i = 0; i < 5; i++) {
      expect((await post(route, body(`rl${i}-${_name}@example.com`), ip)).status).toBe(200);
    }
    const blocked = await post(route, body(`rl5-${_name}@example.com`), ip);
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(await leadCount(`rl5-${_name}@example.com`)).toBe(0);
  });

  it("keeps the lead when the email provider fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_BASE_URL", "http://localhost:1");
    const email = `mailfail-${_name}@example.com`;

    const response = await post(route, body(email));

    expect(response.status).toBe(200);
    const row = (await db.execute({ sql: "select email_status from leads where email = ?", args: [email] })).rows[0];
    expect(row.email_status).toBe("failed");
  });

  it("returns an error when the lead cannot be saved", async () => {
    await db.execute("alter table leads rename to leads_hidden");
    try {
      const response = await post(route, body(`nosave-${_name}@example.com`));
      expect(response.status).toBe(500);
      expect((await response.json()).success).toBe(false);
    } finally {
      await db.execute("alter table leads_hidden rename to leads");
    }
  });

  it("requires a Turnstile token when Turnstile is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
    const email = `turnstile-${_name}@example.com`;

    expect((await post(route, body(email))).status).toBe(403);
    expect(await leadCount(email)).toBe(0);
  });

  it("rejects a token Cloudflare says is invalid", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ success: false })));
    const email = `badtoken-${_name}@example.com`;

    expect((await post(route, body(email, { turnstileToken: "bad" }))).status).toBe(403);
    expect(await leadCount(email)).toBe(0);
  });
});

describe("contact form validation", () => {
  it.each([
    ["message over the limit", { message: "x".repeat(5001) }],
    ["unknown service", { service: "hack" }],
    ["newline in name", { name: "a\r\nBcc: x@y.z" }],
  ])("rejects %s", async (_case, extra) => {
    expect((await post(contactPOST, contactBody("v@example.com", extra))).status).toBe(400);
  });
});

describe("confirmation message", () => {
  it("does not promise an email that was not sent", async () => {
    const response = await post(contactPOST, contactBody("noinbox@example.com"));
    expect((await response.json()).message).not.toMatch(/inbox/i);
  });

  it("escapes user input in the email HTML", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const sent: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init: RequestInit) => {
        sent.push(JSON.parse(String(init.body)).html);
        return Response.json({ id: "1" });
      })
    );

    await post(contactPOST, contactBody("xss@example.com", { name: "<img src=x onerror=1>" }));

    expect(sent.length).toBe(2);
    expect(sent.join("")).not.toContain("<img src=x");
    expect(sent.join("")).toContain("&lt;img");
  });
});
