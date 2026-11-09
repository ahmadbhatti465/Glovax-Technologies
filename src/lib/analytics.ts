declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Sends a Google Analytics event. Does nothing unless analytics is configured. */
export function trackEvent(name: string, params?: Record<string, string>) {
  if (!GA_ID) return;
  window.dataLayer ??= [];
  // gtag reads the arguments object, so an array would be ignored.
  (function gtag(..._args: unknown[]) {
    window.dataLayer?.push(arguments);
  })("event", name, params);
}
