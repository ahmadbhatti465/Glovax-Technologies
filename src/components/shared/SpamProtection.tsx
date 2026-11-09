"use client";

import { useEffect, useRef } from "react";
import { HONEYPOT_FIELD } from "@/lib/lead-schemas";

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const CHALLENGE_TIMEOUT_MS = 60_000;

let scriptLoad: Promise<void> | undefined;

// Loaded on first submit, so pages don't pay for Turnstile until it's needed.
function loadTurnstile() {
  scriptLoad ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoad = undefined;
      reject(new Error("Could not load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

/** Resolves to undefined on failure; the server then decides what to do. */
async function getTurnstileToken(container: HTMLElement | null) {
  if (!SITE_KEY || !container) return undefined;

  try {
    await loadTurnstile();
  } catch {
    return undefined;
  }

  return new Promise<string | undefined>((resolve) => {
    let widgetId: string | undefined;
    const finish = (token?: string) => {
      clearTimeout(timer);
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
      resolve(token);
    };
    const timer = setTimeout(() => finish(), CHALLENGE_TIMEOUT_MS);

    widgetId = window.turnstile?.render(container, {
      sitekey: SITE_KEY,
      appearance: "interaction-only",
      callback: (token: string) => finish(token),
      "error-callback": () => {
        finish();
        return true;
      },
      "timeout-callback": () => finish(),
    });
    if (widgetId === undefined) finish();
  });
}

/** Attach formRef to the form and render turnstileSlot where a challenge may appear. */
export function useSpamProtection() {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  // Starts the download once someone begins filling in the form, so submitting isn't slowed by it.
  useEffect(() => {
    const form = formRef.current;
    if (!SITE_KEY || !form) return;
    const warmUp = () => void loadTurnstile().catch(() => undefined);
    form.addEventListener("focusin", warmUp, { once: true });
    return () => form.removeEventListener("focusin", warmUp);
  }, []);

  async function getProtectionFields() {
    const honeypot = formRef.current?.elements.namedItem(HONEYPOT_FIELD) as HTMLInputElement | null;
    return {
      [HONEYPOT_FIELD]: honeypot?.value || undefined,
      turnstileToken: await getTurnstileToken(turnstileRef.current),
    };
  }

  return { formRef, turnstileSlot: <div ref={turnstileRef} />, getProtectionFields };
}

/** Invisible to people; simple bots fill in every input they find. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
