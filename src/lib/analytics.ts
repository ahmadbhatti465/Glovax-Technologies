declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export type Consent = "granted" | "denied";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const STORAGE_KEY = "glovax-cookie-consent";
const CHOICE_LIFETIME_MS = 180 * 24 * 60 * 60 * 1000;

let consent: Consent | null | undefined;
let preferencesOpen = false;
let started = false;
const listeners = new Set<() => void>();

// gtag reads the arguments object, so an array would be ignored.
function gtag(..._args: unknown[]) {
  window.dataLayer ??= [];
  window.dataLayer.push(arguments);
}

function readStoredChoice(): Consent | null {
  try {
    const { value, at } = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") ?? {};
    const isValid = value === "granted" || value === "denied";
    return isValid && Date.now() - at < CHOICE_LIFETIME_MS ? value : null;
  } catch {
    return null;
  }
}

export function getConsent() {
  if (consent === undefined) consent = readStoredChoice();
  return consent;
}

function setAnalyticsDisabled(disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disabled-${GA_ID}`] = disabled;
}

function clearAnalyticsCookies() {
  const names = document.cookie
    .split("; ")
    .map((cookie) => cookie.split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const rootDomain = `.${location.hostname.replace(/^www\./, "")}`;
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${rootDomain}`;
  }
}

/** Loads Google Analytics. Does nothing without an ID or the visitor's consent. */
export function startAnalytics() {
  if (!GA_ID || started || getConsent() !== "granted") return;
  started = true;

  // Consent Mode v2: everything starts denied, and only measurement is granted.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", GA_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

export function saveConsent(value: Consent) {
  consent = value;
  preferencesOpen = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }));
  } catch {
    // Without storage the choice lasts for this page view, and the banner returns next time.
  }

  if (value === "granted") {
    if (started) {
      setAnalyticsDisabled(false);
      gtag("consent", "update", { analytics_storage: "granted" });
    }
    startAnalytics();
  } else if (GA_ID) {
    if (started) {
      gtag("consent", "update", { analytics_storage: "denied" });
      setAnalyticsDisabled(true);
    }
    clearAnalyticsCookies();
  }

  listeners.forEach((listener) => listener());
}

export function openCookiePreferences() {
  preferencesOpen = true;
  listeners.forEach((listener) => listener());
}

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function shouldShowConsentBanner() {
  return Boolean(GA_ID) && (preferencesOpen || getConsent() === null);
}

/** Sends a Google Analytics event, only if analytics is set up and accepted. */
export function trackEvent(name: string, params?: Record<string, string>) {
  if (!GA_ID || getConsent() !== "granted") return;
  startAnalytics();
  gtag("event", name, params);
}
