import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
