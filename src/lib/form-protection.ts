import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/constants";
import { reportError } from "@/lib/monitoring";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const WINDOW_MS = 60 * 60 * 1000;

interface ProtectionOptions {
  scope: string;
  maxPerHour: number;
  honeypot?: string;
  turnstileToken?: string;
}

async function isHuman(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Both keys are needed: with only the secret, browsers would never get a token.
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true;
  if (!token) return false;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (result["error-codes"]?.some((code) => code.includes("secret"))) {
      await reportError("Turnstile rejected TURNSTILE_SECRET_KEY", new Error(result["error-codes"].join(", ")));
    }
    return result.success === true;
  } catch (error) {
    // Fails open: a Cloudflare outage must not block genuine enquiries, and the
    // honeypot and rate limit still apply.
    await reportError("Turnstile verification is unavailable", error);
    return true;
  }
}

/**
 * Runs the spam checks for a public form. Returns the response to send when
 * the submission should stop here, or null when it may proceed.
 */
export async function protectSubmission(
  request: Request,
  { scope, maxPerHour, honeypot, turnstileToken }: ProtectionOptions
) {
  // Bots get a normal-looking success so they have no signal to adapt to.
  if (honeypot) {
    return NextResponse.json({ success: true, message: "Thanks! We'll be in touch soon." });
  }

  const ip = getClientIp(request.headers);
  const rateLimit = await consumeRateLimit({
    scope,
    identifier: ip,
    limit: maxPerHour,
    windowMs: WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: `Too many submissions. Please try again later or email us at ${siteConfig.email}.` },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  if (!(await isHuman(turnstileToken, ip))) {
    return NextResponse.json(
      { success: false, message: `We couldn't verify your submission. Please try again or email us at ${siteConfig.email}.` },
      { status: 403 }
    );
  }

  return null;
}
