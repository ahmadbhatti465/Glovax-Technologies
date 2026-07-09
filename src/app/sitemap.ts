import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
    { path: "/team", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/career", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let postSlugs: string[] = [];
  try {
    const rows = await db.select().from(blogPosts);
    postSlugs = rows.map((p) => p.slug);
  } catch {
    // DB unavailable
  }

  const blogEntries: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}