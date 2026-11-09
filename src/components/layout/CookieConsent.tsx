"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  GA_ID,
  openCookiePreferences,
  saveConsent,
  shouldShowConsentBanner,
  startAnalytics,
  subscribeToConsent,
} from "@/lib/analytics";

// Deliberately identical, so rejecting is as easy as accepting.
const BUTTON_CLASS =
  "h-9 flex-1 rounded-full border border-white/[0.14] bg-white/[0.06] px-5 text-sm font-medium text-brand-textPrimary " +
  "transition-colors hover:bg-white/[0.12] sm:flex-none";

const RETURNING_VISITOR_DELAY_MS = 2000;

/** Shows the consent choice, and starts analytics for visitors who already accepted. */
export function CookieConsent() {
  const showBanner = useSyncExternalStore(subscribeToConsent, shouldShowConsentBanner, () => false);

  useEffect(() => {
    const timer = setTimeout(startAnalytics, RETURNING_VISITOR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-canvas-surface px-4 py-3"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-brand-textSecondary">
          We&apos;d like to use Google Analytics cookies to understand how this site is used. They stay off unless you
          accept.{" "}
          <Link href="/privacy" className="underline hover:text-brand-textPrimary">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => saveConsent("denied")} className={BUTTON_CLASS}>
            Reject
          </button>
          <button type="button" onClick={() => saveConsent("granted")} className={BUTTON_CLASS}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

/** Lets visitors change their mind later. */
export function CookieSettingsButton() {
  if (!GA_ID) return null;

  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="text-xs text-brand-textMuted transition-colors hover:text-brand-textSecondary"
    >
      Cookie settings
    </button>
  );
}
