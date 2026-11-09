/** Browser counterpart to reportError, for the error pages. */
export function reportClientError(error: Error) {
  console.error(error);
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  void import("@sentry/nextjs").then((Sentry) => Sentry.captureException(error));
}
