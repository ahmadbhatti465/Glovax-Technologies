import { afterEach, describe, expect, it, vi } from "vitest";
import { SignJWT } from "jose";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { createSession, hasValidSigningSecret, passwordsMatch, verifySession } from "@/lib/admin-auth";

const VALID_SECRET = process.env.JWT_SECRET!;

afterEach(() => {
  process.env.JWT_SECRET = VALID_SECRET;
});

describe("passwordsMatch", () => {
  it("accepts the right password and rejects others of any length", () => {
    expect(passwordsMatch("correct-horse", "correct-horse")).toBe(true);
    expect(passwordsMatch("wrong", "correct-horse")).toBe(false);
    expect(passwordsMatch("", "correct-horse")).toBe(false);
  });
});

describe("sessions", () => {
  it("verifies a session it created", async () => {
    expect(await verifySession(await createSession())).toBe(true);
  });

  it("rejects garbage", async () => {
    expect(await verifySession("not-a-token")).toBe(false);
  });

  it("rejects a token forged with the old fallback key", async () => {
    const forged = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("fallback-secret-min-32-characters-long"));
    expect(await verifySession(forged)).toBe(false);
  });

  it("fails closed when the secret is missing or short", async () => {
    const token = await createSession();

    process.env.JWT_SECRET = "too-short";
    expect(hasValidSigningSecret()).toBe(false);
    expect(await verifySession(token)).toBe(false);
    await expect(createSession()).rejects.toThrow("JWT_SECRET");

    delete process.env.JWT_SECRET;
    expect(await verifySession(token)).toBe(false);
  });
});
