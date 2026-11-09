import { beforeEach, describe, expect, it } from "vitest";
import { createClient } from "@libsql/client";
import { isRedirectLoop, recordSlugRename, saveRedirect } from "@/lib/redirects";

const db = createClient({ url: process.env.DATABASE_URL! });

const rows = async () =>
  (await db.execute("select source, destination from redirects order by source")).rows.map(
    (row) => `${row.source}->${row.destination}`
  );

beforeEach(async () => {
  await db.execute("delete from redirects");
});

describe("recordSlugRename", () => {
  it("creates a redirect from the old URL", async () => {
    await recordSlugRename("/blog/a", "/blog/b", true);
    expect(await rows()).toEqual(["/blog/a->/blog/b"]);
  });

  it("does not form a loop when renamed back", async () => {
    await recordSlugRename("/blog/a", "/blog/b", true);
    await recordSlugRename("/blog/b", "/blog/a", true);
    expect(await rows()).toEqual(["/blog/b->/blog/a"]);
  });

  it("points older URLs straight at the newest one", async () => {
    await recordSlugRename("/blog/a", "/blog/b", true);
    await recordSlugRename("/blog/b", "/blog/c", true);
    expect(await rows()).toEqual(["/blog/a->/blog/c", "/blog/b->/blog/c"]);
  });

  it("frees the new URL even when no redirect is wanted", async () => {
    await recordSlugRename("/blog/a", "/blog/b", true);
    await recordSlugRename("/blog/b", "/blog/a", false);
    expect(await rows()).toEqual([]);
  });
});

describe("saveRedirect", () => {
  it("refuses a redirect to itself, ignoring a trailing slash", async () => {
    expect(await saveRedirect("/x", "/x")).toBe(false);
    expect(await saveRedirect("/x", "/x/")).toBe(false);
    expect(await rows()).toEqual([]);
  });

  it("refuses a redirect that would close a cycle", async () => {
    expect(await saveRedirect("/a", "/b")).toBe(true);
    expect(await saveRedirect("/b", "/c")).toBe(true);
    expect(await saveRedirect("/c", "/a")).toBe(false);
  });

  it("updates an existing source", async () => {
    await saveRedirect("/a", "/b");
    await saveRedirect("/a", "/c", 302);
    expect(await rows()).toEqual(["/a->/c"]);
  });
});

describe("isRedirectLoop", () => {
  const edge = (source: string, destination: string) => ({ source, destination });

  it("detects direct and indirect loops", () => {
    expect(isRedirectLoop([edge("/a", "/a")], "/a")).toBe(true);
    expect(isRedirectLoop([edge("/a", "/b"), edge("/b", "/a")], "/a")).toBe(true);
    expect(isRedirectLoop([edge("/z", "/a"), edge("/a", "/b"), edge("/b", "/a")], "/z")).toBe(true);
  });

  it("allows a chain that ends", () => {
    expect(isRedirectLoop([edge("/a", "/b"), edge("/b", "/c")], "/a")).toBe(false);
  });
});
