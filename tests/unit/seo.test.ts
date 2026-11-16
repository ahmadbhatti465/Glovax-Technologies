import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/lib/constants";
import { resolveCanonicalUrl } from "@/lib/utils";

describe("canonical URLs", () => {
  const live = ["/work/khan-herbals", "/work/musa-travel-service"];

  it("falls back to the page's own URL when the canonical points to a missing page", () => {
    expect(
      resolveCanonicalUrl(`${siteConfig.url}/work/does-not-exist`, "/work/khan-herbals", live)
    ).toBe(`${siteConfig.url}/work/khan-herbals`);
  });

  it("keeps a canonical that points to another live page", () => {
    expect(resolveCanonicalUrl("/work/musa-travel-service", "/work/khan-herbals", live)).toBe(
      `${siteConfig.url}/work/musa-travel-service`
    );
  });

  it("keeps self-canonicals, off-site canonicals and the default", () => {
    expect(
      resolveCanonicalUrl("https://glovaxtechnologies.com/work/khan-herbals/", "/work/khan-herbals", [])
    ).toBe(`${siteConfig.url}/work/khan-herbals/`);
    expect(resolveCanonicalUrl("https://example.com/post", "/work/khan-herbals", [])).toBe(
      "https://example.com/post"
    );
    expect(resolveCanonicalUrl(null, "/work/khan-herbals", [])).toBe(
      `${siteConfig.url}/work/khan-herbals`
    );
  });
});

describe("robots.txt", () => {
  it("lets crawlers reach noindexed tag pages so the noindex is seen", () => {
    const rules = [robots().rules].flat();
    for (const rule of rules) {
      expect([rule.disallow].flat()).not.toContain("/blog/tag/");
      expect([rule.disallow].flat()).toContain("/admin");
    }
  });
});
