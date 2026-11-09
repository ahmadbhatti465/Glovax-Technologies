// In its own file so the browser forms can use it without loading zod.
// A deliberately dull name: browsers autofill fields called "website" or "url",
// which would silently discard real visitors as bots.
export const HONEYPOT_FIELD = "reference_code";
