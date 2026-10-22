import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
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
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

