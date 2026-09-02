export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "dashboard",
  "login",
  "logout",
  "me",
  "services",
  "work",
  "portfolio",
  "blog",
  "about",
  "contact",
  "career",
  "careers",
  "directory",
  "privacy",
  "terms",
  "sitemap",
  "sitemap.xml",
  "robots.txt",
  "favicon.ico",
  "manifest.json",
  "manifest.webmanifest",
  "icon.png",
  "apple-icon.png",
  "uploads",
  "images",
  "preview",
  "_next",
]);

export function cleanSlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove special characters
    .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

export function generateSlug(title: string): string {
  return cleanSlug(title);
}

export function isReservedSlug(slug: string): boolean {
  const normalized = cleanSlug(slug);
  return RESERVED_SLUGS.has(normalized);
}

export function validateSlug(slug: string): { valid: boolean; error?: string; warnings: string[] } {
  const warnings: string[] = [];
  const cleaned = cleanSlug(slug);

  if (!cleaned) {
    return { valid: false, error: "Slug cannot be empty.", warnings: [] };
  }

  if (isReservedSlug(cleaned)) {
    return {
      valid: false,
      error: `"${cleaned}" is a reserved system route. Please choose a different slug.`,
      warnings: [],
    };
  }

  if (cleaned.length > 70) {
    warnings.push("Slug is longer than 70 characters. Shorter URLs generally perform better in search engines.");
  }

  if (/\d{4,}/.test(cleaned)) {
    warnings.push("Slug contains 4+ consecutive digits. Avoid date strings or raw IDs in slugs if possible.");
  }

  return { valid: true, warnings };
}
