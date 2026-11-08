import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// Tag archives are noindexed and number in the hundreds; blocking them keeps
// Google's crawl queue on pages that can actually be indexed.
const disallow = ["/admin", "/api", "/blog/tag/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: [
          "Googlebot",
          "Google-Extended",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

