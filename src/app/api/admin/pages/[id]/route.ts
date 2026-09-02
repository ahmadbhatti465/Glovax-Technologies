import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { pages, redirects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { eq, and, ne } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(pages).where(eq(pages.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const existingRows = await db.select().from(pages).where(eq(pages.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    let newSlug = existing.slug;
    if (body.slug) {
      newSlug = cleanSlug(body.slug);
      const slugCheck = validateSlug(newSlug);
      if (!slugCheck.valid) {
        return NextResponse.json({ error: slugCheck.error }, { status: 400 });
      }

      // Check if slug is used by another page
      const duplicate = await db
        .select()
        .from(pages)
        .where(and(eq(pages.slug, newSlug), ne(pages.id, id)));
      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: `The slug "/${newSlug}" is already in use by another page.` },
          { status: 409 }
        );
      }
    }

    const now = new Date();

    // Check if slug changed and create 301 redirect if requested or page was published
    if (existing.slug !== newSlug) {
      if (body.createRedirect !== false) {
        const sourcePath = `/${existing.slug}`;
        const destPath = `/${newSlug}`;

        // Check if redirect source already exists
        const existingRedirect = await db
          .select()
          .from(redirects)
          .where(eq(redirects.source, sourcePath));

        if (existingRedirect.length > 0) {
          await db
            .update(redirects)
            .set({ destination: destPath, statusCode: 301 })
            .where(eq(redirects.source, sourcePath));
        } else {
          await db.insert(redirects).values({
            id: `redir_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            source: sourcePath,
            destination: destPath,
            statusCode: 301,
            createdAt: now,
          });
        }
      }
    }

    // Version history update
    const currentHistory = Array.isArray(existing.versionHistory)
      ? existing.versionHistory
      : [];
    const nextVersionNum = currentHistory.length + 1;
    const updatedHistory = [
      ...currentHistory,
      {
        version: nextVersionNum,
        title: body.title || existing.title,
        updatedAt: now.toISOString(),
        author: body.author || existing.author || "Admin",
        note: body.versionNote || (existing.slug !== newSlug ? `Slug changed to /${newSlug}` : `Version ${nextVersionNum} saved`),
      },
    ];

    let publishedAt = existing.publishedAt;
    if (body.status === "published" && !publishedAt) {
      publishedAt = now;
    } else if (body.publishedAt) {
      publishedAt = new Date(body.publishedAt);
    }

    const updatedPage = {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      slug: newSlug,
      excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
      content: body.content !== undefined ? body.content : existing.content,
      pageType: body.pageType !== undefined ? body.pageType : existing.pageType,
      featuredImage: body.featuredImage !== undefined ? body.featuredImage : existing.featuredImage,
      featuredImageAlt: body.featuredImageAlt !== undefined ? body.featuredImageAlt : existing.featuredImageAlt,
      featuredImageTitle: body.featuredImageTitle !== undefined ? body.featuredImageTitle : existing.featuredImageTitle,
      featuredImageCaption: body.featuredImageCaption !== undefined ? body.featuredImageCaption : existing.featuredImageCaption,
      seoTitle: body.seoTitle !== undefined ? body.seoTitle : existing.seoTitle,
      metaDescription: body.metaDescription !== undefined ? body.metaDescription : existing.metaDescription,
      focusKeyword: body.focusKeyword !== undefined ? body.focusKeyword : existing.focusKeyword,
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : existing.secondaryKeywords,
      canonicalUrl: body.canonicalUrl !== undefined ? body.canonicalUrl : existing.canonicalUrl,
      robotsIndex: body.robotsIndex !== undefined ? Boolean(body.robotsIndex) : existing.robotsIndex,
      robotsFollow: body.robotsFollow !== undefined ? Boolean(body.robotsFollow) : existing.robotsFollow,
      includeInSitemap: body.includeInSitemap !== undefined ? Boolean(body.includeInSitemap) : existing.includeInSitemap,
      sitemapPriority: typeof body.sitemapPriority === "number" ? body.sitemapPriority : existing.sitemapPriority,
      changeFrequency: body.changeFrequency !== undefined ? body.changeFrequency : existing.changeFrequency,
      ogTitle: body.ogTitle !== undefined ? body.ogTitle : existing.ogTitle,
      ogDescription: body.ogDescription !== undefined ? body.ogDescription : existing.ogDescription,
      ogImage: body.ogImage !== undefined ? body.ogImage : existing.ogImage,
      ogImageAlt: body.ogImageAlt !== undefined ? body.ogImageAlt : existing.ogImageAlt,
      twitterTitle: body.twitterTitle !== undefined ? body.twitterTitle : existing.twitterTitle,
      twitterDescription: body.twitterDescription !== undefined ? body.twitterDescription : existing.twitterDescription,
      twitterImage: body.twitterImage !== undefined ? body.twitterImage : existing.twitterImage,
      schemaType: body.schemaType !== undefined ? body.schemaType : existing.schemaType,
      faqs: Array.isArray(body.faqs) ? body.faqs : existing.faqs,
      status: body.status !== undefined ? body.status : existing.status,
      author: body.author !== undefined ? body.author : existing.author,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      readTime: typeof body.readTime === "number" ? body.readTime : existing.readTime,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      updatedAt: now,
      versionHistory: updatedHistory,
    };

    await db.update(pages).set(updatedPage).where(eq(pages.id, id));

    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/${existing.slug}`);
    if (newSlug !== existing.slug) revalidatePath(`/${newSlug}`);
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, page: { id, ...updatedPage } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const existingRows = await db.select().from(pages).where(eq(pages.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const slug = existingRows[0].slug;

    await db.delete(pages).where(eq(pages.id, id));

    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/${slug}`);
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
