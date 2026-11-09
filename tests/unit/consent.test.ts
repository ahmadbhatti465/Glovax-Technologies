import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DAY_MS = 24 * 60 * 60 * 1000;

function stubBrowser(initialCookies = "") {
  const stored = new Map<string, string>();
  const scripts: { src?: string; async?: boolean }[] = [];
  const cookieWrites: string[] = [];
  const windowStub: Record<string, unknown> & { dataLayer?: unknown[] } = {};

  vi.stubGlobal("window", windowStub);
  vi.stubGlobal("location", { hostname: "www.example.com" });
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
  });
  vi.stubGlobal("document", {
    get cookie() {
      return initialCookies;
    },
    set cookie(value: string) {
      cookieWrites.push(value);
    },
    createElement: () => ({}),
    head: { appendChild: (script: { src?: string }) => scripts.push(script) },
  });

  const commands = () => (windowStub.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
  return { stored, scripts, cookieWrites, windowStub, commands };
}

const load = () => import("@/lib/analytics");

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("cookie consent", () => {
  it("asks first and loads nothing before a choice is made", async () => {
    const browser = stubBrowser();
    const { shouldShowConsentBanner, startAnalytics, trackEvent } = await load();

    expect(shouldShowConsentBanner()).toBe(true);
    startAnalytics();
    trackEvent("generate_lead", { form: "contact" });

    expect(browser.scripts).toHaveLength(0);
    expect(browser.commands()).toHaveLength(0);
  });

  it("never asks and never loads without a GA ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const browser = stubBrowser();
    const { saveConsent, shouldShowConsentBanner } = await load();

    expect(shouldShowConsentBanner()).toBe(false);
    saveConsent("granted");
    expect(browser.scripts).toHaveLength(0);
  });

  it("loads Google once after accepting, with consent denied by default", async () => {
    const browser = stubBrowser();
    const { saveConsent, shouldShowConsentBanner, startAnalytics } = await load();

    saveConsent("granted");
    startAnalytics();

    expect(browser.scripts).toHaveLength(1);
    expect(browser.scripts[0].src).toContain("gtag/js?id=G-TEST");
    expect(shouldShowConsentBanner()).toBe(false);

    const [first, second] = browser.commands();
    expect(first.slice(0, 2)).toEqual(["consent", "default"]);
    expect(first[2]).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    expect(second).toEqual(["consent", "update", { analytics_storage: "granted" }]);
  });

  it("loads nothing after rejecting, and remembers the choice", async () => {
    const browser = stubBrowser();
    const first = await load();
    first.saveConsent("denied");
    expect(browser.scripts).toHaveLength(0);

    vi.resetModules();
    const second = await load();
    second.startAnalytics();
    expect(second.getConsent()).toBe("denied");
    expect(second.shouldShowConsentBanner()).toBe(false);
    expect(browser.scripts).toHaveLength(0);
  });

  it("asks again once the choice is six months old", async () => {
    const browser = stubBrowser();
    browser.stored.set("glovax-cookie-consent", JSON.stringify({ value: "granted", at: Date.now() - 181 * DAY_MS }));
    const { shouldShowConsentBanner } = await load();
    expect(shouldShowConsentBanner()).toBe(true);
  });

  it("treats a corrupted saved choice as no choice", async () => {
    const browser = stubBrowser();
    browser.stored.set("glovax-cookie-consent", "{not json");
    const { getConsent } = await load();
    expect(getConsent()).toBeNull();
  });

  it("stops tracking and removes cookies when consent is withdrawn", async () => {
    const browser = stubBrowser("_ga=1; _ga_ABC=2; other=3");
    const { saveConsent, trackEvent } = await load();

    saveConsent("granted");
    saveConsent("denied");
    const before = browser.commands().length;
    trackEvent("generate_lead");

    expect(browser.commands()).toHaveLength(before);
    expect(browser.commands().at(-1)).toEqual(["consent", "update", { analytics_storage: "denied" }]);
    expect(browser.windowStub["ga-disabled-G-TEST"]).toBe(true);
    expect(browser.cookieWrites.some((write) => write.startsWith("_ga=;"))).toBe(true);
    expect(browser.cookieWrites.some((write) => write.startsWith("_ga_ABC=;") && write.includes("domain=.example.com"))).toBe(true);
    expect(browser.cookieWrites.some((write) => write.startsWith("other="))).toBe(false);
  });

  it("can reopen the choice from the footer", async () => {
    stubBrowser();
    const { openCookiePreferences, saveConsent, shouldShowConsentBanner } = await load();
    saveConsent("denied");
    expect(shouldShowConsentBanner()).toBe(false);
    openCookiePreferences();
    expect(shouldShowConsentBanner()).toBe(true);
  });
});
