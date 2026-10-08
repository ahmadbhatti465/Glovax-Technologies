import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import {
  hasScheduledBlogPostCapacity,
  MAX_SCHEDULED_BLOG_POSTS_PER_DAY,
} from "@/lib/blog-publishing";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.toLowerCase();

    let rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt));

    if (category && category !== "all") {
      rows = rows.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== "all") {
      rows = rows.filter((r) => (r.status || "published") === status);
    }

    if (query) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.slug.toLowerCase().includes(query) ||
          r.author.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          (r.focusKeyword && r.focusKeyword.toLowerCase().includes(query)) ||
          (r.tags && Array.isArray(r.tags) && r.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    return NextResponse.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch blog posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Post Title is required" }, { status: 400 });
    }

    const rawSlug = body.slug ? cleanSlug(body.slug) : cleanSlug(body.title);
    const slugCheck = validateSlug(rawSlug);
    if (!slugCheck.valid) {
      return NextResponse.json({ error: slugCheck.error }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, rawSlug));
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `The slug "/blog/${rawSlug}" is already in use by another article. Please choose a unique slug.` },
        { status: 409 }
      );
    }

    const id = body.id || `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const status = body.status ?? "draft";
    const publishedAt = body.publishedAt || now.toISOString().slice(0, 10);

    if (!["draft", "published", "scheduled", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid post status" }, { status: 400 });
    }
    const scheduledTimestamp = new Date(publishedAt).getTime();
    if (
      status === "scheduled" &&
      (!Number.isFinite(scheduledTimestamp) || scheduledTimestamp <= now.getTime())
    ) {
      return NextResponse.json(
        { error: "Choose a future publish date for scheduled articles" },
        { status: 400 }
      );
    }
    if (
      status === "scheduled" &&
      !(await hasScheduledBlogPostCapacity(publishedAt))
    ) {
      return NextResponse.json(
        {
          error: `Maximum of ${MAX_SCHEDULED_BLOG_POSTS_PER_DAY} posts can be scheduled for ${publishedAt}`,
        },
        { status: 409 }
      );
    }

    const plainText = (body.content || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 220));

    const newPost = {
      id,
      title: body.title.trim(),
      slug: rawSlug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      author: body.author || "Glovax Team",
      category: body.category || "Technology",
      tags: Array.isArray(body.tags) ? body.tags : [],
      publishedAt,
      readTime: typeof body.readTime === "number" ? body.readTime : readTime,
      featured: Boolean(body.featured),
      featuredImage: body.featuredImage || null,
      featuredImageAlt: body.featuredImageAlt || null,
      featuredImageTitle: body.featuredImageTitle || null,
      featuredImageCaption: body.featuredImageCaption || null,
      seoTitle: body.seoTitle || null,
      metaDescription: body.metaDescription || null,
      focusKeyword: body.focusKeyword || null,
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : [],
      canonicalUrl: body.canonicalUrl || null,
      robotsIndex: body.robotsIndex !== undefined ? Boolean(body.robotsIndex) : true,
      robotsFollow: body.robotsFollow !== undefined ? Boolean(body.robotsFollow) : true,
      ogTitle: body.ogTitle || null,
      ogDescription: body.ogDescription || null,
      ogImage: body.ogImage || null,
      ogImageAlt: body.ogImageAlt || null,
      twitterTitle: body.twitterTitle || null,
      twitterDescription: body.twitterDescription || null,
      twitterImage: body.twitterImage || null,
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      status,
      createdAt: now,
      updatedAt: now,
      versionHistory: [
        {
          version: 1,
          title: body.title.trim(),
          updatedAt: now.toISOString(),
          author: body.author || "Admin",
          note: "Initial article version created",
        },
      ],
    };

    await db.insert(blogPosts).values(newPost);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/page/[page]", "page");
    revalidatePath("/blog/category/[slug]", "page");
    revalidatePath("/blog/tag/[slug]", "page");
    revalidatePath("/sitemap.xml");
    if (newPost.slug) revalidatePath(`/blog/${newPost.slug}`);
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
