import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { normalizeCanonicalUrl } from "@/lib/utils";
import { db } from "@/db";
import { blogPosts, portfolioItems, services, teamMembers, jobPositions, siteContent, businesses, pages, redirects } from "@/db/schema";
import { BLOG_PAGE_SIZE } from "@/lib/blog-pagination";
import { toBlogTaxonomySlug } from "@/lib/blog-taxonomy";

export const revalidate = 60;

function toSitemapDate(date: Date | string | number | null | undefined): Date | undefined {
  if (!date) return undefined;
  try {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  } catch {
    return undefined;
  }
}

async function getMaxTimestamp(
  table: typeof blogPosts | typeof portfolioItems | typeof services | typeof teamMembers | typeof jobPositions
): Promise<Date | null> {
  const rows = await db.select().from(table);
  const timestamps = rows
    .flatMap((row) => [row.createdAt, "updatedAt" in row ? row.updatedAt : null])
    .filter(Boolean) as Date[];
  if (timestamps.length === 0) return null;
  return new Date(Math.max(...timestamps.map((d) => d.getTime())));
}

async function getSiteContentTimestamp(key: string): Promise<Date | null> {
  const rows = await db.select().from(siteContent);
  const found = rows.find((row) => row.key === key);
  return found?.updatedAt ?? null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [
    servicesUpdated,
    portfolioUpdated,
    teamUpdated,
    careersUpdated,
    aboutUpdated,
  ] = await Promise.all([
    getMaxTimestamp(services),
    getMaxTimestamp(portfolioItems),
    getMaxTimestamp(teamMembers),
    getMaxTimestamp(jobPositions),
    getSiteContentTimestamp("about"),
  ]);

  let directoryUpdated: Date | null = null;
  const bizRowsForTimestamp = await db
    .select({ createdAt: businesses.createdAt })
    .from(businesses);
  const directoryTimestamps = bizRowsForTimestamp
    .map((r) => r.createdAt)
    .filter(Boolean) as Date[];
  if (directoryTimestamps.length > 0) {
    directoryUpdated = new Date(
      Math.max(...directoryTimestamps.map((date) => date.getTime()))
    );
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: toSitemapDate(servicesUpdated),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: toSitemapDate(servicesUpdated),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified: toSitemapDate(portfolioUpdated),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: toSitemapDate(aboutUpdated),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/team`,
      lastModified: toSitemapDate(teamUpdated),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/career`,
      lastModified: toSitemapDate(careersUpdated),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/directory`,
      lastModified: toSitemapDate(directoryUpdated),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  let posts: {
    slug: string;
    publishedAt: string;
    updatedAt: Date | null;
    category: string;
    tags: string[];
  }[] = [];
  let directorySlugs: { slug: string; createdAt: Date | null }[] = [];
  let caseStudyIds: {
    id: string;
    slug: string;
    canonicalUrl: string | null;
    publishedAt: string | null;
    updatedAt: Date | null;
    createdAt: Date | null;
    sitemapPriority: number;
    changeFrequency: string;
  }[] = [];
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
  const [blogRows, bizRows, caseRows, pageRows, redirectRows] = await Promise.all([
    db
      .select({
        slug: blogPosts.slug,
        status: blogPosts.status,
        robotsIndex: blogPosts.robotsIndex,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
        category: blogPosts.category,
        tags: blogPosts.tags,
      })
      .from(blogPosts),
    db.select({ slug: businesses.slug, createdAt: businesses.createdAt }).from(businesses),
    db.select().from(portfolioItems),
    db.select().from(pages),
    db.select({ source: redirects.source }).from(redirects),
  ]);
  const redirectSources = new Set(
    redirectRows.map((row) => row.source.replace(/\/+$/, "") || "/")
  );
  posts = blogRows
    .filter((post) => {
      const isPublished =
        post.status === "published" ||
        (post.status === "scheduled" &&
          new Date(post.publishedAt).getTime() <= now.getTime());
      const path = `/blog/${post.slug}`;
      return (
        isPublished &&
        post.robotsIndex !== false &&
        !redirectSources.has(path)
      );
    })
    .map((post) => ({
      slug: post.slug,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      category: post.category,
      tags: post.tags ?? [],
    }));
  directorySlugs = bizRows;
  caseStudyIds = caseRows
    .filter((post) => (post.status || "published") === "published" && post.includeInSitemap !== false && post.robotsIndex !== false)
    .map((post) => ({
      id: post.id,
      slug: post.slug || post.id,
      canonicalUrl: post.canonicalUrl,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
      sitemapPriority: post.sitemapPriority,
      changeFrequency: post.changeFrequency,
    }));
  cmsPages = pageRows.map((post) => ({
    slug: post.slug,
    canonicalUrl: post.canonicalUrl,
    status: post.status,
    robotsIndex: Boolean(post.robotsIndex),
    includeInSitemap: Boolean(post.includeInSitemap),
    sitemapPriority: post.sitemapPriority,
    changeFrequency: post.changeFrequency,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    scheduledAt: post.scheduledAt,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const published = toSitemapDate(post.publishedAt);
    const updated = post.updatedAt ? toSitemapDate(post.updatedAt) : undefined;
    const lastModified = updated ?? published;
    if (!lastModified) return [];
    return {
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });
  const blogLastModified = posts
    .map((post) => toSitemapDate(post.updatedAt) ?? toSitemapDate(post.publishedAt))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const blogIndexEntry: MetadataRoute.Sitemap[number] = {
    url: `${siteConfig.url}/blog`,
    ...(blogLastModified ? { lastModified: blogLastModified } : {}),
    changeFrequency: "daily",
    priority: 0.8,
  };

  const directoryEntries: MetadataRoute.Sitemap = directorySlugs
    .filter((business) => !redirectSources.has(`/directory/${business.slug}`))
    .map((business) => ({
      url: `${siteConfig.url}/directory/${business.slug}`,
      lastModified: toSitemapDate(business.createdAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudyIds.flatMap((post) => {
    const path = `/work/${post.slug || post.id}`;
    const pageUrl = normalizeCanonicalUrl(post.canonicalUrl, path);
    const published = toSitemapDate(post.publishedAt);
    const updated = post.updatedAt ? toSitemapDate(post.updatedAt) : undefined;
    const lastModified = updated ?? published ?? toSitemapDate(post.createdAt);
    if (
      redirectSources.has(path) ||
      pageUrl.replace(/\/+$/, "") !== `${siteConfig.url}${path}`.replace(/\/+$/, "")
    ) {
      return [];
    }

    return [{
      url: pageUrl,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: (post.changeFrequency as MetadataRoute.Sitemap[0]["changeFrequency"]) || "monthly",
      priority: post.sitemapPriority || 0.8,
    }];
  });

  // Filter and map published CMS pages for the sitemap
  const cmsPageEntries: MetadataRoute.Sitemap = cmsPages
    .filter(
      (p) =>
        p.status === "published" &&
        p.includeInSitemap &&
        p.robotsIndex &&
        (!p.scheduledAt || new Date(p.scheduledAt) <= now) &&
        !redirectSources.has(`/${p.slug}`)
    )
    .flatMap((p) => {
      const published = toSitemapDate(p.publishedAt);
      const updated = p.updatedAt ? toSitemapDate(p.updatedAt) : undefined;
      const lastModified = updated ?? published;
      const path = `/${p.slug}`;
      const pageUrl = normalizeCanonicalUrl(p.canonicalUrl, path);
      if (
        !lastModified ||
        pageUrl.replace(/\/+$/, "") !== `${siteConfig.url}${path}`.replace(/\/+$/, "")
      ) {
        return [];
      }

      return [{
        url: pageUrl,
        lastModified,
        changeFrequency: (p.changeFrequency as "monthly" | "daily" | "weekly" | "yearly" | "always" | "hourly" | "never") || "monthly",
        priority: p.sitemapPriority || 0.8,
      }];
    });

  const blogPageCount = Math.ceil(posts.length / BLOG_PAGE_SIZE);
  const blogPaginationEntries: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, blogPageCount - 1) },
    (_, index) => {
      const pageNumber = index + 2;
      const pagePosts = posts.slice(
        (pageNumber - 1) * BLOG_PAGE_SIZE,
        pageNumber * BLOG_PAGE_SIZE
      );
      const lastModified = pagePosts
        .map((post) => toSitemapDate(post.updatedAt) ?? toSitemapDate(post.publishedAt))
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      return {
        url: `${siteConfig.url}/blog/page/${pageNumber}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }
  );

  const taxonomyLastModified = posts
    .map((post) => toSitemapDate(post.updatedAt) ?? toSitemapDate(post.publishedAt))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const categorySlugs = new Set(
    posts.map((post) => toBlogTaxonomySlug(post.category)).filter(Boolean)
  );
  const tagSlugs = new Set(
    posts.flatMap((post) => post.tags.map(toBlogTaxonomySlug)).filter(Boolean)
  );
  const taxonomyEntries: MetadataRoute.Sitemap = [
    ...[...categorySlugs].map((slug) => ({
      url: `${siteConfig.url}/blog/category/${slug}`,
      ...(taxonomyLastModified ? { lastModified: taxonomyLastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...[...tagSlugs].map((slug) => ({
      url: `${siteConfig.url}/blog/tag/${slug}`,
      ...(taxonomyLastModified ? { lastModified: taxonomyLastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  const entries = [
    ...staticRoutes,
    blogIndexEntry,
    ...cmsPageEntries,
    ...caseStudyEntries,
    ...blogEntries,
    ...blogPaginationEntries,
    ...taxonomyEntries,
    ...directoryEntries,
  ];
  return entries.filter((entry) => {
    const path = new URL(entry.url).pathname.replace(/\/+$/, "") || "/";
    return !redirectSources.has(path);
  });
}
