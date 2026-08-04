import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { db } from "@/db";
import { blogPosts, portfolioItems, services, teamMembers, jobPositions, siteContent, businesses } from "@/db/schema";

function toSitemapDate(date: Date | string | number | null | undefined): Date | undefined {
  if (!date) return undefined;
  try {
    return new Date(date);
  } catch {
    return undefined;
  }
}

async function getMaxTimestamp(
  table: typeof blogPosts | typeof portfolioItems | typeof services | typeof teamMembers | typeof jobPositions
): Promise<Date | null> {
  try {
    const rows = await db.select().from(table);
    const timestamps = rows
      .flatMap((row) => [row.createdAt, "updatedAt" in row ? row.updatedAt : null])
      .filter(Boolean) as Date[];
    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps.map((d) => d.getTime())));
  } catch {
    return null;
  }
}

async function getSiteContentTimestamp(key: string): Promise<Date | null> {
  try {
    const rows = await db.select().from(siteContent);
    const found = rows.find((row) => row.key === key);
    return found?.updatedAt ?? null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [
    servicesUpdated,
    portfolioUpdated,
    blogUpdated,
    teamUpdated,
    careersUpdated,
    aboutUpdated,
  ] = await Promise.all([
    getMaxTimestamp(services),
    getMaxTimestamp(portfolioItems),
    getMaxTimestamp(blogPosts),
    getMaxTimestamp(teamMembers),
    getMaxTimestamp(jobPositions),
    getSiteContentTimestamp("about"),
  ]);

  let directoryUpdated: Date | null = null;
  try {
    const bizRows = await db
      .select({ createdAt: businesses.createdAt })
      .from(businesses);
    const timestamps = bizRows.map((r) => r.createdAt).filter(Boolean) as Date[];
    if (timestamps.length > 0) {
      directoryUpdated = new Date(Math.max(...timestamps.map((d) => d.getTime())));
    }
  } catch {
    // DB unavailable
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: toSitemapDate(servicesUpdated) ?? now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: toSitemapDate(servicesUpdated) ?? now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified: toSitemapDate(portfolioUpdated) ?? now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: toSitemapDate(blogUpdated) ?? now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: toSitemapDate(aboutUpdated) ?? now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/team`,
      lastModified: toSitemapDate(teamUpdated) ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/career`,
      lastModified: toSitemapDate(careersUpdated) ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/directory`,
      lastModified: toSitemapDate(directoryUpdated) ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let posts: { slug: string; publishedAt: string }[] = [];
  let directorySlugs: { slug: string }[] = [];
  try {
    posts = await db.select({ slug: blogPosts.slug, publishedAt: blogPosts.publishedAt }).from(blogPosts);
    const bizRows = await db.select({ slug: businesses.slug }).from(businesses);
    directorySlugs = bizRows;
  } catch {
    // DB unavailable
  }

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: toSitemapDate(post.publishedAt) ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const directoryEntries: MetadataRoute.Sitemap = directorySlugs.map((b) => ({
    url: `${siteConfig.url}/directory/${b.slug}`,
    lastModified: toSitemapDate(directoryUpdated) ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogEntries, ...directoryEntries];
}
