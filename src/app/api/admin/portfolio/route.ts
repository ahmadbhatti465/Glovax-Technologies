import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(portfolioItems);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400 });
    }
    if (!body.client?.trim()) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }
    if (!body.category?.trim()) {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }
    if (!body.description?.trim()) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    // Slug validation and uniqueness
    let rawSlug = body.slug ? cleanSlug(body.slug) : cleanSlug(body.title);
    if (!rawSlug) {
      rawSlug = `project-${Date.now()}`;
    }

    const slugCheck = validateSlug(rawSlug);
    if (!slugCheck.valid) {
      return NextResponse.json({ error: slugCheck.error }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await db.select().from(portfolioItems).where(eq(portfolioItems.slug, rawSlug));
    if (existing.length > 0) {
      rawSlug = `${rawSlug}-${Date.now().toString().slice(-4)}`;
    }

    const id = body.id?.trim() || rawSlug;

    // Check if ID already exists
    const existingId = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    const finalId = existingId.length > 0 ? `${id}-${Date.now().toString().slice(-4)}` : id;

    const record = {
      id: finalId,
      title: body.title.trim(),
      slug: rawSlug,
      client: body.client.trim(),
      category: body.category.trim(),
      shortDescription: body.shortDescription?.trim() || null,
      description: body.description.trim(),
      link: body.link?.trim() || null,
      clientWebsite: body.clientWebsite?.trim() || null,
      industry: body.industry?.trim() || null,
      services: Array.isArray(body.services) ? body.services : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      timeline: body.timeline?.trim() || null,
      projectYear: body.projectYear?.trim() || null,
      location: body.location?.trim() || null,
      featured: Boolean(body.featured),
      status: body.status || "published",
      challenge: body.challenge?.trim() || null,
      solution: body.solution?.trim() || null,
      process: Array.isArray(body.process) ? body.process : [],
      results: Array.isArray(body.results) ? body.results : [],
      keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures : [],
      testimonialQuote: body.testimonialQuote?.trim() || null,
      testimonialAuthor: body.testimonialAuthor?.trim() || null,
      testimonialRole: body.testimonialRole?.trim() || null,
      testimonialCompany: body.testimonialCompany?.trim() || null,
      testimonialRating: typeof body.testimonialRating === "number" ? body.testimonialRating : 5,
      image: body.image?.trim() || null,
      imageAlt: body.imageAlt?.trim() || null,
      imageTitle: body.imageTitle?.trim() || null,
      imageCaption: body.imageCaption?.trim() || null,
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      relatedProjects: Array.isArray(body.relatedProjects) ? body.relatedProjects : [],
      seoTitle: body.seoTitle?.trim() || null,
      metaDescription: body.metaDescription?.trim() || null,
      focusKeyword: body.focusKeyword?.trim() || null,
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : [],
      canonicalUrl: body.canonicalUrl?.trim() || null,
      robotsIndex: body.robotsIndex !== undefined ? Boolean(body.robotsIndex) : true,
      robotsFollow: body.robotsFollow !== undefined ? Boolean(body.robotsFollow) : true,
      includeInSitemap: body.includeInSitemap !== undefined ? Boolean(body.includeInSitemap) : true,
      sitemapPriority: typeof body.sitemapPriority === "number" ? body.sitemapPriority : 0.8,
      changeFrequency: body.changeFrequency || "monthly",
      ogTitle: body.ogTitle?.trim() || null,
      ogDescription: body.ogDescription?.trim() || null,
      ogImage: body.ogImage?.trim() || null,
      ogImageAlt: body.ogImageAlt?.trim() || null,
      twitterTitle: body.twitterTitle?.trim() || null,
      twitterDescription: body.twitterDescription?.trim() || null,
      twitterImage: body.twitterImage?.trim() || null,
      schemaType: body.schemaType || "CreativeWork",
      publishedAt: body.publishedAt || (body.status === "published" ? new Date().toISOString().slice(0, 10) : null),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(portfolioItems).values(record);

    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${rawSlug}`);
    revalidatePath("/sitemap.xml");
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, item: record }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create portfolio item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
