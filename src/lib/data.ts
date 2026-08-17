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

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const rows = await withRetry(() => db.select().from(schema.blogPosts));
    return rows.map((row) => ({
      ...serializeDates(row, true),
      tags: row.tags ?? [],
      featured: Boolean(row.featured),
    }));
  } catch {
    return [];
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const rows = await withRetry(() => db.select().from(schema.blogPosts));
    const found = rows.find((row) => row.slug === slug);
    if (!found) return null;
    return {
      ...serializeDates(found, true),
      tags: found.tags ?? [],
      featured: Boolean(found.featured),
    };
  } catch {
    return null;
  }
});

/** All blog slugs, used by generateStaticParams so builds pre-render every post. */
export const getAllBlogSlugs = cache(async (): Promise<{ slug: string }[]> => {
  try {
    const rows = await withRetry(() => db.select({ slug: schema.blogPosts.slug }).from(schema.blogPosts));
    return rows;
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
      const rows = await withRetry(() => db.select().from(schema.blogPosts));
      const posts = rows
        .filter((row) => row.slug !== currentSlug)
        .map((row) => ({
          ...serializeDates(row, true),
          tags: row.tags ?? [],
          featured: Boolean(row.featured),
        }))
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
