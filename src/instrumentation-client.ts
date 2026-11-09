import { sentryOptions } from "@/lib/sentry-options";

// A dynamic import keeps Sentry out of the page bundle, and without a DSN the
// chunk is never requested.
if (sentryOptions.dsn) {
  void import("@sentry/nextjs").then((Sentry) => Sentry.init(sentryOptions));
}
