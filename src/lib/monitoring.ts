import { DrizzleQueryError } from "drizzle-orm/errors";

/** Logs an error and, when Sentry is configured, reports it there too. */
export async function reportError(context: string, rawError: unknown) {
  // Drizzle puts query parameters in its message, and for leads those are
  // visitors' personal details. The underlying driver error has no values.
  const error = rawError instanceof DrizzleQueryError ? (rawError.cause ?? new Error("Database query failed")) : rawError;

  console.error(context, error);

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(error instanceof Error ? error : new Error(`${context}: ${String(error)}`), {
      tags: { context },
    });
  } catch (sentryError) {
    console.error("Failed to report an error to Sentry", sentryError);
  }
}
