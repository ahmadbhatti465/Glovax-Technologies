import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const pageType = searchParams.get("type");
    const query = searchParams.get("q")?.toLowerCase();

    let rows = await db.select().from(pages).orderBy(desc(pages.updatedAt));

    if (status && status !== "all") {
      rows = rows.filter((r) => r.status === status);
    }

    if (pageType && pageType !== "all") {
      rows = rows.filter((r) => r.pageType === pageType);
    }

    if (query) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.slug.toLowerCase().includes(query) ||
          (r.focusKeyword && r.focusKeyword.toLowerCase().includes(query)) ||
          (r.excerpt && r.excerpt.toLowerCase().includes(query))
      );
    }

    return NextResponse.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch pages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Page Title is required" }, { status: 400 });
    }

    const rawSlug = body.slug ? cleanSlug(body.slug) : cleanSlug(body.title);
    const slugCheck = validateSlug(rawSlug);
    if (!slugCheck.valid) {
      return NextResponse.json({ error: slugCheck.error }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.select().from(pages).where(eq(pages.slug, rawSlug));
    if (existing.length > 0) {
      return NextResponse.json(
        { error: `The slug "/${rawSlug}" is already in use by another page. Please choose a unique slug.` },
        { status: 409 }
      );
    }

    const id = body.id || `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const publishedAt = body.status === "published" ? body.publishedAt || now : null;

    const newPage = {
      id,
      title: body.title.trim(),
      slug: rawSlug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      pageType: body.pageType || "standard",
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
      includeInSitemap: body.includeInSitemap !== undefined ? Boolean(body.includeInSitemap) : true,
      sitemapPriority: typeof body.sitemapPriority === "number" ? body.sitemapPriority : 0.8,
      changeFrequency: body.changeFrequency || "monthly",
      ogTitle: body.ogTitle || null,
      ogDescription: body.ogDescription || null,
      ogImage: body.ogImage || null,
      ogImageAlt: body.ogImageAlt || null,
      twitterTitle: body.twitterTitle || null,
      twitterDescription: body.twitterDescription || null,
      twitterImage: body.twitterImage || null,
      schemaType: body.schemaType || "WebPage",
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      status: body.status || "draft",
      author: body.author || "Glovax Team",
      featured: Boolean(body.featured),
      readTime: typeof body.readTime === "number" ? body.readTime : 3,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      createdAt: now,
      updatedAt: now,
      versionHistory: [
        {
          version: 1,
          title: body.title.trim(),
          updatedAt: now.toISOString(),
          author: body.author || "Admin",
          note: "Initial version created",
        },
      ],
    };

    await db.insert(pages).values(newPage);

    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    if (newPage.slug) revalidatePath(`/${newPage.slug}`);
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, page: newPage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
