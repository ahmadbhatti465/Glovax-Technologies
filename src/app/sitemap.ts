import type { MetadataRoute } from "next";
import { db } from "@/db";
import { blogPosts, pages, portfolioItems, redirects } from "@/db/schema";
import { siteConfig } from "@/lib/constants";
import { normalizeCanonicalUrl } from "@/lib/utils";
import { getBusinesses, getHiddenNavHrefs } from "@/lib/data";
import { PUBLIC_STATIC_ROUTES } from "@/lib/public-routes";
import { isBlogPostLive } from "@/lib/blog-publishing";

export const revalidate = 60;

function toSitemapDate(date: Date | string | null | undefined): Date | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, portfolios, cmsPages, listings, redirectRows] = await Promise.all([
    db
      .select({
        slug: blogPosts.slug,
        status: blogPosts.status,
        robotsIndex: blogPosts.robotsIndex,
        canonicalUrl: blogPosts.canonicalUrl,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts),
    db
      .select({
        id: portfolioItems.id,
        slug: portfolioItems.slug,
        status: portfolioItems.status,
        robotsIndex: portfolioItems.robotsIndex,
        includeInSitemap: portfolioItems.includeInSitemap,
        canonicalUrl: portfolioItems.canonicalUrl,
        publishedAt: portfolioItems.publishedAt,
        updatedAt: portfolioItems.updatedAt,
        createdAt: portfolioItems.createdAt,
        sitemapPriority: portfolioItems.sitemapPriority,
        changeFrequency: portfolioItems.changeFrequency,
      })
      .from(portfolioItems),
    db
      .select({
        slug: pages.slug,
        status: pages.status,
        robotsIndex: pages.robotsIndex,
        includeInSitemap: pages.includeInSitemap,
        canonicalUrl: pages.canonicalUrl,
        scheduledAt: pages.scheduledAt,
        updatedAt: pages.updatedAt,
        publishedAt: pages.publishedAt,
        sitemapPriority: pages.sitemapPriority,
        changeFrequency: pages.changeFrequency,
      })
      .from(pages),
    getBusinesses(),
    db.select({ source: redirects.source }).from(redirects),
  ]);

  const hiddenPaths = await getHiddenNavHrefs();
  const redirectSources = new Set(
    redirectRows.map((row) => row.source.replace(/\/+$/, "") || "/")
  );
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES
    .filter((path) => !redirectSources.has(path || "/") && !hiddenPaths.includes(path))
    .map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path === "/services" || path === "/blog" ? 0.9 : 0.7,
    }));

  const blogEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const path = `/blog/${post.slug}`;
    const url = normalizeCanonicalUrl(post.canonicalUrl, path);
    const localUrl = `${siteConfig.url}${path}`;
    const lastModified =
      toSitemapDate(post.updatedAt) ?? toSitemapDate(post.publishedAt);

    if (
      !isBlogPostLive(post) ||
      post.robotsIndex === false ||
      !lastModified ||
      url.replace(/\/+$/, "") !== localUrl.replace(/\/+$/, "") ||
      redirectSources.has(path)
    ) {
      return [];
    }

    return [{ url: localUrl, lastModified, changeFrequency: "monthly", priority: 0.7 }];
  });

  const portfolioEntries: MetadataRoute.Sitemap = portfolios.flatMap((project) => {
    const slug = project.slug || project.id;
    const path = `/work/${slug}`;
    const localUrl = `${siteConfig.url}${path}`;
    const canonicalUrl = normalizeCanonicalUrl(project.canonicalUrl, path);
    const lastModified =
      toSitemapDate(project.updatedAt) ??
      toSitemapDate(project.publishedAt) ??
      toSitemapDate(project.createdAt);

    if (
      project.status !== "published" ||
      project.includeInSitemap === false ||
      project.robotsIndex === false ||
      !lastModified ||
      canonicalUrl.replace(/\/+$/, "") !== localUrl.replace(/\/+$/, "") ||
      redirectSources.has(path)
    ) {
      return [];
    }

    return [{
      url: localUrl,
      lastModified,
      changeFrequency: (project.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"]) || "monthly",
      priority: project.sitemapPriority || 0.8,
    }];
  });

  const now = Date.now();
  const cmsEntries: MetadataRoute.Sitemap = cmsPages.flatMap((page) => {
    const path = `/${page.slug}`;
    const localUrl = `${siteConfig.url}${path}`;
    const canonicalUrl = normalizeCanonicalUrl(page.canonicalUrl, path);
    if (
      page.status !== "published" ||
      (page.scheduledAt && page.scheduledAt.getTime() > now) ||
      page.includeInSitemap === false ||
      page.robotsIndex === false ||
      canonicalUrl.replace(/\/+$/, "") !== localUrl.replace(/\/+$/, "") ||
      redirectSources.has(path)
    ) {
      return [];
    }
    return [{
      url: localUrl,
      lastModified: toSitemapDate(page.updatedAt) ?? toSitemapDate(page.publishedAt),
      changeFrequency: (page.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"]) || "monthly",
      priority: page.sitemapPriority || 0.8,
    }];
  });

  const listingEntries: MetadataRoute.Sitemap = listings
    .map((listing) => `/directory/${listing.slug}`)
    .filter((path) => !redirectSources.has(path))
    .map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: "monthly", priority: 0.5 }));

  return [...staticEntries, ...cmsEntries, ...portfolioEntries, ...listingEntries, ...blogEntries];
}