import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { db } from "@/db";
import { blogPosts, portfolioItems, services, teamMembers, jobPositions, siteContent, businesses, pages } from "@/db/schema";

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
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let posts: { slug: string; publishedAt: string; updatedAt: Date | null }[] = [];
  let directorySlugs: { slug: string }[] = [];
  let caseStudyIds: { id: string }[] = [];
  let cmsPages: {
    slug: string;
    canonicalUrl: string | null;
    status: string;
    robotsIndex: boolean;
    includeInSitemap: boolean;
    sitemapPriority: number;
    changeFrequency: string;
    publishedAt: Date | null;
    updatedAt: Date | null;
    scheduledAt: Date | null;
  }[] = [];

  try {
    const blogRows = await db
      .select({
        slug: blogPosts.slug,
        status: blogPosts.status,
        robotsIndex: blogPosts.robotsIndex,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts);
    posts = blogRows
      .filter((p) => (p.status || "published") === "published" && p.robotsIndex !== false)
      .map((p) => ({
        slug: p.slug,
        publishedAt: p.publishedAt,
        updatedAt: p.updatedAt,
      }));

    const bizRows = await db.select({ slug: businesses.slug }).from(businesses);
    directorySlugs = bizRows;
    const caseRows = await db.select({ id: portfolioItems.id }).from(portfolioItems);
    caseStudyIds = caseRows;

    const pageRows = await db.select().from(pages);
    cmsPages = pageRows.map((p) => ({
      slug: p.slug,
      canonicalUrl: p.canonicalUrl,
      status: p.status,
      robotsIndex: Boolean(p.robotsIndex),
      includeInSitemap: Boolean(p.includeInSitemap),
      sitemapPriority: p.sitemapPriority,
      changeFrequency: p.changeFrequency,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
      scheduledAt: p.scheduledAt,
    }));
  } catch {
    // DB unavailable
  }

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const published = toSitemapDate(post.publishedAt);
    const updated = post.updatedAt ? toSitemapDate(post.updatedAt) : undefined;
    const lastModified = updated && published && updated > published ? updated : published;
    return {
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: lastModified ?? now,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  const directoryEntries: MetadataRoute.Sitemap = directorySlugs.map((b) => ({
    url: `${siteConfig.url}/directory/${b.slug}`,
    lastModified: toSitemapDate(directoryUpdated) ?? now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudyIds.map((p) => ({
    url: `${siteConfig.url}/work/${p.id}`,
    lastModified: toSitemapDate(portfolioUpdated) ?? now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Filter and map published CMS pages for the sitemap
  const cmsPageEntries: MetadataRoute.Sitemap = cmsPages
    .filter(
      (p) =>
        p.status === "published" &&
        p.includeInSitemap &&
        p.robotsIndex &&
        (!p.scheduledAt || new Date(p.scheduledAt) <= now)
    )
    .map((p) => {
      const published = toSitemapDate(p.publishedAt);
      const updated = p.updatedAt ? toSitemapDate(p.updatedAt) : undefined;
      const lastModified = updated && published && updated > published ? updated : published || now;
      const pageUrl = p.canonicalUrl || `${siteConfig.url}/${p.slug}`;

      return {
        url: pageUrl,
        lastModified,
        changeFrequency: (p.changeFrequency as "monthly" | "daily" | "weekly" | "yearly" | "always" | "hourly" | "never") || "monthly",
        priority: p.sitemapPriority || 0.8,
      };
    });

  return [...staticRoutes, ...cmsPageEntries, ...caseStudyEntries, ...blogEntries, ...directoryEntries];
}
