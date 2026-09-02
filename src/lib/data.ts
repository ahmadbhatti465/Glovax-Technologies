import { cache } from "react";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type {
  Service,
  PortfolioItem,
  Testimonial,
  TeamMember,
  BlogPost,
  JobPosition,
  Business,
  Page,
  Redirect,
  InternalLinkTarget,
} from "@/types";

/**
 * Retry a DB-backed call on transient failures.
 *
 * The blog routes are statically rendered against the hosted (Turso) database.
 * A brief network blip at request/build time used to surface as a 404 or an
 * empty list (Google recorded two blog posts as 404s for exactly this reason).
 * Retrying masks transient errors so a single hiccup doesn't poison a cached
 * page or a crawl. We keep it short so it never meaningfully slows the happy path.
 */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 150 * (i + 1)));
      }
    }
  }
  throw lastError;
}

function serializeDates<T extends { createdAt?: Date | null; updatedAt?: Date | null }>(
  row: T,
  keepUpdatedAt = false
): Omit<T, "createdAt" | "updatedAt"> {
  const { createdAt, updatedAt, ...rest } = row;
  if (keepUpdatedAt && updatedAt) {
    (rest as Record<string, unknown>).updatedAt = updatedAt;
  }
  return rest as Omit<T, "createdAt" | "updatedAt">;
}

export const getServices = cache(async (): Promise<Service[]> => {
  try {
    const rows = await db.select().from(schema.services);
    return rows.map((row) => ({
      ...serializeDates(row),
      features: row.features ?? [],
    }));
  } catch {
    return [];
  }
});

export const getPortfolioItems = cache(async (): Promise<PortfolioItem[]> => {
  try {
    const rows = await db.select().from(schema.portfolioItems);
    return rows.map((row) => ({
      ...serializeDates(row),
      results: row.results ?? [],
      technologies: row.technologies ?? [],
      featured: Boolean(row.featured),
      link: row.link ?? undefined,
      image: row.image ?? undefined,
    }));
  } catch {
    return [];
  }
});

export const getFeaturedPortfolioItems = cache(async (): Promise<PortfolioItem[]> => {
  const items = await getPortfolioItems();
  return items.filter((item) => item.featured);
});

export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  try {
    const rows = await db.select().from(schema.teamMembers);
    return rows.map((row) => ({
      ...serializeDates(row),
      expertise: row.expertise ?? [],
      image: row.image ?? undefined,
    }));
  } catch {
    return [];
  }
});

export const getJobPositions = cache(async (): Promise<JobPosition[]> => {
  try {
    const rows = await db.select().from(schema.jobPositions);
    return rows.map((row) => ({
      ...serializeDates(row),
      responsibilities: row.responsibilities ?? [],
      requirements: row.requirements ?? [],
      type: row.type as JobPosition["type"],
    }));
  } catch {
    return [];
  }
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  try {
    const rows = await db.select().from(schema.testimonials);
    return rows.map((row) => ({
      ...serializeDates(row),
      // Optional display fields are nullable in the DB — normalize to undefined
      // so the UI's truthiness checks work (no broken <Image> or stray "●" flag).
      avatar: row.avatar || undefined,
      country: row.country || undefined,
      countryCode: row.countryCode || undefined,
      linkedin: row.linkedin || undefined,
      projectType: row.projectType || undefined,
    }));
  } catch {
    return [];
  }
});

export const getBlogPosts = cache(async (status?: string): Promise<BlogPost[]> => {
  try {
    const rows = await withRetry(() => db.select().from(schema.blogPosts));
    const items = rows.map((row) => ({
      ...serializeDates(row, true),
      tags: row.tags ?? [],
      featured: Boolean(row.featured),
      featuredImage: row.featuredImage ?? undefined,
      featuredImageAlt: row.featuredImageAlt ?? undefined,
      featuredImageTitle: row.featuredImageTitle ?? undefined,
      featuredImageCaption: row.featuredImageCaption ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      metaDescription: row.metaDescription ?? undefined,
      focusKeyword: row.focusKeyword ?? undefined,
      secondaryKeywords: row.secondaryKeywords ?? [],
      canonicalUrl: row.canonicalUrl ?? undefined,
      robotsIndex: row.robotsIndex !== undefined ? Boolean(row.robotsIndex) : true,
      robotsFollow: row.robotsFollow !== undefined ? Boolean(row.robotsFollow) : true,
      ogTitle: row.ogTitle ?? undefined,
      ogDescription: row.ogDescription ?? undefined,
      ogImage: row.ogImage ?? undefined,
      ogImageAlt: row.ogImageAlt ?? undefined,
      twitterTitle: row.twitterTitle ?? undefined,
      twitterDescription: row.twitterDescription ?? undefined,
      twitterImage: row.twitterImage ?? undefined,
      faqs: row.faqs ?? [],
      status: (row.status as BlogPost["status"]) || "published",
      versionHistory: row.versionHistory ?? [],
    }));

    if (status) {
      return items.filter((p) => p.status === status);
    }
    return items;
  } catch {
    return [];
  }
});

export const getBlogPostBySlug = cache(
  async (slug: string, allowUnpublished = false): Promise<BlogPost | null> => {
    try {
      const posts = await getBlogPosts();
      const found = posts.find((row) => row.slug === slug);
      if (!found) return null;
      if (!allowUnpublished && found.status !== "published") return null;
      return found;
    } catch {
      return null;
    }
  }
);

/** All blog slugs, used by generateStaticParams so builds pre-render every post. */
export const getAllBlogSlugs = cache(async (): Promise<{ slug: string }[]> => {
  try {
    const posts = await getBlogPosts("published");
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
});

/**
 * Related posts for cross-linking. Prefers posts sharing the current post's
 * category, then fills with the most recent posts. Excludes the current post.
 * Internal links between articles help Google crawl and value the thinner
 * pages that otherwise only get a link from /blog.
 */
export const getRelatedPosts = cache(
  async (currentSlug: string, category?: string | null, limit = 3): Promise<BlogPost[]> => {
    try {
      const allPosts = await getBlogPosts("published");
      const posts = allPosts
        .filter((row) => row.slug !== currentSlug)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      const sameCategory = category ? posts.filter((p) => p.category === category) : [];
      const related = [...sameCategory, ...posts.filter((p) => p.category !== category)];
      return related.slice(0, limit);
    } catch {
      return [];
    }
  }
);

export async function getSiteContent<T>(key: string): Promise<T | null> {
  try {
    const rows = await db.select().from(schema.siteContent);
    const found = rows.find((row) => row.key === key);
    if (!found) return null;
    return found.value as T;
  } catch {
    return null;
  }
}

export async function getLatestUpdatedAt(
  tables: (keyof typeof schema)[]
): Promise<Date | null> {
  try {
    const dates: Date[] = [];
    for (const tableName of tables) {
      const table = schema[tableName];
      const rows = await db.select().from(table);
      for (const row of rows) {
        if ("updatedAt" in row && row.updatedAt) {
          dates.push(row.updatedAt as Date);
        }
        if ("createdAt" in row && row.createdAt) {
          dates.push(row.createdAt as Date);
        }
      }
    }
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates.map((d) => d.getTime())));
  } catch {
    return null;
  }
}

export async function getSiteContentUpdatedAt(key: string): Promise<Date | null> {
  try {
    const rows = await db.select().from(schema.siteContent);
    const found = rows.find((row) => row.key === key);
    return found?.updatedAt ?? null;
  } catch {
    return null;
  }
}

export const getBusinesses = cache(async (): Promise<Business[]> => {
  try {
    const rows = await db.select().from(schema.businesses);
    return rows.map((row) => ({
      ...serializeDates(row),
      hours: row.hours ?? [],
      tags: row.tags ?? [],
      featured: Boolean(row.featured),
      isRemote: Boolean(row.isRemote),
      address: row.address ?? undefined,
      phone: row.phone ?? undefined,
      website: row.website ?? undefined,
      image: row.image ?? undefined,
    }));
  } catch {
    return [];
  }
});

export const getBusinessBySlug = cache(
  async (slug: string): Promise<Business | null> => {
    try {
      const items = await getBusinesses();
      return items.find((b) => b.slug === slug) ?? null;
    } catch {
      return null;
    }
  }
);

export const getPages = cache(async (status?: string): Promise<Page[]> => {
  try {
    const rows = await withRetry(() => db.select().from(schema.pages));
    const items = rows.map((row) => ({
      ...serializeDates(row, true),
      secondaryKeywords: row.secondaryKeywords ?? [],
      faqs: row.faqs ?? [],
      versionHistory: row.versionHistory ?? [],
      robotsIndex: Boolean(row.robotsIndex),
      robotsFollow: Boolean(row.robotsFollow),
      includeInSitemap: Boolean(row.includeInSitemap),
      featured: Boolean(row.featured),
      featuredImage: row.featuredImage ?? undefined,
      featuredImageAlt: row.featuredImageAlt ?? undefined,
      featuredImageTitle: row.featuredImageTitle ?? undefined,
      featuredImageCaption: row.featuredImageCaption ?? undefined,
      seoTitle: row.seoTitle ?? undefined,
      metaDescription: row.metaDescription ?? undefined,
      focusKeyword: row.focusKeyword ?? undefined,
      canonicalUrl: row.canonicalUrl ?? undefined,
      ogTitle: row.ogTitle ?? undefined,
      ogDescription: row.ogDescription ?? undefined,
      ogImage: row.ogImage ?? undefined,
      ogImageAlt: row.ogImageAlt ?? undefined,
      twitterTitle: row.twitterTitle ?? undefined,
      twitterDescription: row.twitterDescription ?? undefined,
      twitterImage: row.twitterImage ?? undefined,
      scheduledAt: row.scheduledAt ? new Date(row.scheduledAt) : null,
      publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
      pageType: row.pageType as Page["pageType"],
      schemaType: row.schemaType as Page["schemaType"],
      changeFrequency: row.changeFrequency as Page["changeFrequency"],
      status: row.status as Page["status"],
    }));

    if (status) {
      return items.filter((p) => p.status === status);
    }
    return items;
  } catch {
    return [];
  }
});

export const getPageBySlug = cache(
  async (slug: string, allowUnpublished = false): Promise<Page | null> => {
    try {
      const pages = await getPages();
      const found = pages.find((p) => p.slug === slug);
      if (!found) return null;

      if (!allowUnpublished) {
        if (found.status !== "published") return null;
        if (found.scheduledAt && new Date(found.scheduledAt) > new Date()) {
          return null; // Not reached scheduled release time yet
        }
      }

      return found;
    } catch {
      return null;
    }
  }
);

export const getAllPageSlugs = cache(async (): Promise<{ slug: string }[]> => {
  try {
    const pages = await getPages("published");
    return pages
      .filter((p) => !p.scheduledAt || new Date(p.scheduledAt) <= new Date())
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
});

export const getRedirect = cache(async (source: string): Promise<Redirect | null> => {
  try {
    const normalizedSource = source.startsWith("/") ? source : `/${source}`;
    const rows = await db.select().from(schema.redirects);
    const found = rows.find(
      (r) => r.source === normalizedSource || r.source === normalizedSource.replace(/^\//, "")
    );
    if (!found) return null;
    return {
      ...serializeDates(found),
      statusCode: found.statusCode ?? 301,
    };
  } catch {
    return null;
  }
});

export const getInternalLinkTargets = cache(async (): Promise<InternalLinkTarget[]> => {
  const targets: InternalLinkTarget[] = [
    { title: "Home", url: "/", category: "System", description: "Glovax Technologies Homepage" },
    { title: "Services Overview", url: "/services", category: "System", description: "All Technology Services" },
    { title: "Our Work / Case Studies", url: "/work", category: "System", description: "Client Portfolio" },
    { title: "About Us", url: "/about", category: "System", description: "Company Information" },
    { title: "Contact Us", url: "/contact", category: "System", description: "Get in touch / Consultation" },
    { title: "Careers", url: "/career", category: "System", description: "Job openings at Glovax" },
    { title: "Blog / Insights", url: "/blog", category: "System", description: "Technology articles" },
    { title: "Privacy Policy", url: "/privacy", category: "System", description: "Legal privacy policy" },
    { title: "Terms of Service", url: "/terms", category: "System", description: "Legal terms of service" },
  ];

  try {
    const [serviceList, portfolioList, blogList, pageList] = await Promise.all([
      getServices(),
      getPortfolioItems(),
      getBlogPosts(),
      getPages(),
    ]);

    serviceList.forEach((s) => {
      targets.push({
        title: s.title,
        url: `/services#${s.id}`,
        category: "Service",
        description: s.description.slice(0, 80),
      });
    });

    portfolioList.forEach((p) => {
      targets.push({
        title: `${p.title} (${p.client})`,
        url: p.link || `/work#${p.id}`,
        category: "Portfolio",
        description: p.description.slice(0, 80),
      });
    });

    blogList.forEach((b) => {
      targets.push({
        title: b.title,
        url: `/blog/${b.slug}`,
        category: "Blog",
        description: b.excerpt.slice(0, 80),
      });
    });

    pageList.forEach((p) => {
      targets.push({
        title: `${p.title} (${p.status})`,
        url: `/${p.slug}`,
        category: "Page",
        description: p.excerpt ? p.excerpt.slice(0, 80) : p.pageType,
      });
    });
  } catch {
    // Return base targets if DB encounters temporary issue
  }

  return targets;
});
