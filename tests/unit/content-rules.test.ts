import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isBlogPostLive } from "@/lib/blog-publishing";
import { hasFictionalPhone, isPublishableListing } from "@/lib/directory";
import { PUBLIC_STATIC_ROUTES } from "@/lib/public-routes";
import { assertSeedAllowed, isDevDatabaseUrl } from "@/lib/seed-guard";
import { visibleStats } from "@/lib/site-stats";

describe("directory listings", () => {
  it("recognizes fictional phone numbers", () => {
    expect(hasFictionalPhone("+1 512 555 0192")).toBe(true);
    expect(hasFictionalPhone("+44 20 7946 0880")).toBe(true);
    expect(hasFictionalPhone("+92 42 3577 0001")).toBe(false);
  });

  it("needs a real website and a real phone number", () => {
    expect(isPublishableListing({ phone: "+92 42 3577 0001", website: "https://example.com" })).toBe(true);
    expect(isPublishableListing({ phone: "+92 42 3577 0001", website: null })).toBe(false);
    expect(isPublishableListing({ phone: "+1 512 555 0192", website: "https://example.com" })).toBe(false);
  });
});

describe("site stats", () => {
  it("hides blank and zero values", () => {
    const stats = [
      { value: 42, suffix: "+", label: "Projects" },
      { value: 0, suffix: "%", label: "Satisfaction" },
      { value: "" as unknown as number, suffix: "+", label: "Blank" },
    ];
    expect(visibleStats(stats).map((stat) => stat.label)).toEqual(["Projects"]);
    expect(visibleStats(null)).toEqual([]);
  });
});

describe("scheduled posts", () => {
  const now = Date.parse("2026-06-01");

  it("treats a scheduled post as live once its date passes", () => {
    expect(isBlogPostLive({ status: "scheduled", publishedAt: "2026-05-01" }, now)).toBe(true);
    expect(isBlogPostLive({ status: "scheduled", publishedAt: "2026-07-01" }, now)).toBe(false);
    expect(isBlogPostLive({ status: "draft", publishedAt: "2026-05-01" }, now)).toBe(false);
    expect(isBlogPostLive({ status: "published", publishedAt: "2026-05-01" }, now)).toBe(true);
  });
});

describe("seed guard", () => {
  it("only accepts databases clearly marked as non-production", () => {
    expect(isDevDatabaseUrl("file:./dev.db")).toBe(true);
    expect(isDevDatabaseUrl("libsql://glovax-db-dev-x.turso.io")).toBe(true);
    expect(isDevDatabaseUrl("libsql://glovax-db-x.turso.io")).toBe(false);
    expect(isDevDatabaseUrl("libsql://developer-db.turso.io")).toBe(false);
  });

  it("refuses without explicit permission or in production", () => {
    expect(() => assertSeedAllowed({ DATABASE_URL: "file:./dev.db" })).toThrow("ALLOW_SEED");
    expect(() => assertSeedAllowed({ ALLOW_SEED: "true", VERCEL_ENV: "production", DATABASE_URL: "file:./dev.db" })).toThrow("production");
    expect(() => assertSeedAllowed({ ALLOW_SEED: "true", DATABASE_URL: "file:./dev.db" })).not.toThrow();
  });
});

describe("sitemap routes", () => {
  it("lists every static public page in src/app", () => {
    const appDir = path.resolve("src/app");
    const found = (fs.readdirSync(appDir, { recursive: true }) as string[])
      .map((file) => file.split(path.sep).join("/"))
      .filter((file) => /(^|\/)page\.tsx$/.test(file))
      .map((file) => file.replace(/\/?page\.tsx$/, ""))
      .filter((route) => !route.includes("[") && !route.startsWith("admin"))
      .map((route) => (route ? `/${route}` : ""));

    expect([...found].sort()).toEqual([...PUBLIC_STATIC_ROUTES].sort());
  });
});
