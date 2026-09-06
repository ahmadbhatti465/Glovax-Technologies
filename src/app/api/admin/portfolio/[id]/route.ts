import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { portfolioItems, redirects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const existingRows = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    // Slug checks
    let newSlug = body.slug ? cleanSlug(body.slug) : existing.slug || cleanSlug(body.title || existing.title);
    if (!newSlug) {
      newSlug = existing.id;
    }

    const slugCheck = validateSlug(newSlug);
    if (!slugCheck.valid) {
      return NextResponse.json({ error: slugCheck.error }, { status: 400 });
    }

    // Check slug collision with other items
    const duplicateSlug = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.slug, newSlug));
    const conflicting = duplicateSlug.find((row) => row.id !== id);
    if (conflicting) {
      return NextResponse.json(
        { error: `Slug "${newSlug}" is already in use by another project (${conflicting.title}).` },
        { status: 400 }
      );
    }

    // 301 Redirect creation if slug changed and requested
    const oldSlug = existing.slug || existing.id;
    if (oldSlug && oldSlug !== newSlug && body.createRedirect) {
      try {
        const redirectSource = `/work/${oldSlug}`;
        const redirectDest = `/work/${newSlug}`;
        const existingRedir = await db
          .select()
          .from(redirects)
          .where(eq(redirects.source, redirectSource));
        if (existingRedir.length === 0) {
          await db.insert(redirects).values({
            id: `redir-${Date.now()}`,
            source: redirectSource,
            destination: redirectDest,
            statusCode: 301,
            createdAt: new Date(),
          });
        }
      } catch (redirErr) {
        console.error("Failed to insert auto 301 redirect:", redirErr);
      }
    }

    const updatedData = {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      slug: newSlug,
      client: body.client !== undefined ? body.client.trim() : existing.client,
      category: body.category !== undefined ? body.category.trim() : existing.category,
      shortDescription: body.shortDescription !== undefined ? body.shortDescription?.trim() || null : existing.shortDescription,
      description: body.description !== undefined ? body.description.trim() : existing.description,
      link: body.link !== undefined ? body.link?.trim() || null : existing.link,
      clientWebsite: body.clientWebsite !== undefined ? body.clientWebsite?.trim() || null : existing.clientWebsite,
      industry: body.industry !== undefined ? body.industry?.trim() || null : existing.industry,
      services: Array.isArray(body.services) ? body.services : existing.services,
      technologies: Array.isArray(body.technologies) ? body.technologies : existing.technologies,
      timeline: body.timeline !== undefined ? body.timeline?.trim() || null : existing.timeline,
      projectYear: body.projectYear !== undefined ? body.projectYear?.trim() || null : existing.projectYear,
      location: body.location !== undefined ? body.location?.trim() || null : existing.location,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      status: body.status !== undefined ? body.status : existing.status,
      challenge: body.challenge !== undefined ? body.challenge?.trim() || null : existing.challenge,
      solution: body.solution !== undefined ? body.solution?.trim() || null : existing.solution,
      process: Array.isArray(body.process) ? body.process : existing.process,
      results: Array.isArray(body.results) ? body.results : existing.results,
      keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures : existing.keyFeatures,
      testimonialQuote: body.testimonialQuote !== undefined ? body.testimonialQuote?.trim() || null : existing.testimonialQuote,
      testimonialAuthor: body.testimonialAuthor !== undefined ? body.testimonialAuthor?.trim() || null : existing.testimonialAuthor,
      testimonialRole: body.testimonialRole !== undefined ? body.testimonialRole?.trim() || null : existing.testimonialRole,
      testimonialCompany: body.testimonialCompany !== undefined ? body.testimonialCompany?.trim() || null : existing.testimonialCompany,
      testimonialRating: typeof body.testimonialRating === "number" ? body.testimonialRating : existing.testimonialRating,
      image: body.image !== undefined ? body.image?.trim() || null : existing.image,
      imageAlt: body.imageAlt !== undefined ? body.imageAlt?.trim() || null : existing.imageAlt,
      imageTitle: body.imageTitle !== undefined ? body.imageTitle?.trim() || null : existing.imageTitle,
      imageCaption: body.imageCaption !== undefined ? body.imageCaption?.trim() || null : existing.imageCaption,
      gallery: Array.isArray(body.gallery) ? body.gallery : existing.gallery,
      relatedProjects: Array.isArray(body.relatedProjects) ? body.relatedProjects : existing.relatedProjects,
      seoTitle: body.seoTitle !== undefined ? body.seoTitle?.trim() || null : existing.seoTitle,
      metaDescription: body.metaDescription !== undefined ? body.metaDescription?.trim() || null : existing.metaDescription,
      focusKeyword: body.focusKeyword !== undefined ? body.focusKeyword?.trim() || null : existing.focusKeyword,
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : existing.secondaryKeywords,
      canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl?.trim() || null : existing.canonicalUrl,
      robotsIndex: body.robotsIndex !== undefined ? Boolean(body.robotsIndex) : existing.robotsIndex,
      robotsFollow: body.robotsFollow !== undefined ? Boolean(body.robotsFollow) : existing.robotsFollow,
      includeInSitemap: body.includeInSitemap !== undefined ? Boolean(body.includeInSitemap) : existing.includeInSitemap,
      sitemapPriority: typeof body.sitemapPriority === "number" ? body.sitemapPriority : existing.sitemapPriority,
      changeFrequency: body.changeFrequency !== undefined ? body.changeFrequency : existing.changeFrequency,
      ogTitle: body.ogTitle !== undefined ? body.ogTitle?.trim() || null : existing.ogTitle,
      ogDescription: body.ogDescription !== undefined ? body.ogDescription?.trim() || null : existing.ogDescription,
      ogImage: body.ogImage !== undefined ? body.ogImage?.trim() || null : existing.ogImage,
      ogImageAlt: body.ogImageAlt !== undefined ? body.ogImageAlt?.trim() || null : existing.ogImageAlt,
      twitterTitle: body.twitterTitle !== undefined ? body.twitterTitle?.trim() || null : existing.twitterTitle,
      twitterDescription: body.twitterDescription !== undefined ? body.twitterDescription?.trim() || null : existing.twitterDescription,
      twitterImage: body.twitterImage !== undefined ? body.twitterImage?.trim() || null : existing.twitterImage,
      schemaType: body.schemaType !== undefined ? body.schemaType : existing.schemaType,
      publishedAt: body.publishedAt !== undefined ? body.publishedAt : existing.publishedAt,
      updatedAt: new Date(),
    };

    await db.update(portfolioItems).set(updatedData).where(eq(portfolioItems.id, id));

    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${oldSlug}`);
    revalidatePath(`/work/${newSlug}`);
    revalidatePath("/sitemap.xml");
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, item: { ...existing, ...updatedData } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update portfolio item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const existingRows = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }
    const item = existingRows[0];

    // Optional 301 redirect on delete
    const url = new URL(request.url);
    const createRedirect = url.searchParams.get("createRedirect") === "true";
    const redirectTarget = url.searchParams.get("redirectTarget") || "/work";

    if (createRedirect && (item.slug || item.id)) {
      try {
        await db.insert(redirects).values({
          id: `redir-${Date.now()}`,
          source: `/work/${item.slug || item.id}`,
          destination: redirectTarget,
          statusCode: 301,
          createdAt: new Date(),
        });
      } catch (redirErr) {
        console.error("Failed to create redirect on delete:", redirErr);
      }
    }

    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));

    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath(`/work/${item.slug || item.id}`);
    revalidatePath("/sitemap.xml");
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
