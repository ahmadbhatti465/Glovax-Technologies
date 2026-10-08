import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { siteConfig } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns true only for absolute http(s) URLs. Guards against malformed
 * external links (e.g. "localhost:8501") being rendered as <a href> and
 * discovered as broken/404 pages by crawlers.
 */
export function isValidExternalUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Normalizes any canonical URL to the site's primary canonical domain (https://www.glovaxtechnologies.com).
 * Automatically replaces apex domains (e.g. https://glovaxtechnologies.com), http:// protocols,
 * and relative paths to ensure Google Search Console never encounters redirect loops or non-canonical URLs.
 */
export function normalizeCanonicalUrl(url?: string | null, fallbackPath?: string): string {
  const fallback = `${siteConfig.url}${
    fallbackPath ? (fallbackPath.startsWith("/") ? fallbackPath : `/${fallbackPath}`) : ""
  }`;
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("https://glovaxtechnologies.com")) {
    return trimmed.replace("https://glovaxtechnologies.com", siteConfig.url);
  }
  if (trimmed.startsWith("http://glovaxtechnologies.com")) {
    return trimmed.replace("http://glovaxtechnologies.com", siteConfig.url);
  }
  if (trimmed.startsWith("http://www.glovaxtechnologies.com")) {
    return trimmed.replace("http://www.glovaxtechnologies.com", siteConfig.url);
  }
  if (trimmed.startsWith("/")) {
    return `${siteConfig.url}${trimmed}`;
  }
  return trimmed;
}
