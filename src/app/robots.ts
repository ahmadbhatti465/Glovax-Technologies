import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

// Tag archives are not blocked here: they carry a noindex tag (or return 404
// once their posts are gone), and Google can only see either if it may crawl
// them. Blocking them left old tag URLs stuck in Search Console.
const disallow = ["/admin", "/api"];

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

