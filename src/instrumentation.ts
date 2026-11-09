import type { Instrumentation } from "next";
import { sentryOptions } from "@/lib/sentry-options";

// Sentry is imported only when a DSN exists, so without one it never loads.
export async function register() {
  if (!sentryOptions.dsn) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.init(sentryOptions);
}

export const onRequestError: Instrumentation.onRequestError = async (...args) => {
  if (!sentryOptions.dsn) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
