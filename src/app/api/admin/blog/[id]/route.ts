import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { blogPosts, redirects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug, validateSlug } from "@/lib/slug";
import {
  hasScheduledBlogPostCapacity,
  MAX_SCHEDULED_BLOG_POSTS_PER_DAY,
} from "@/lib/blog-publishing";
import { eq, and, ne } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();

    const existingRows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    const existing = existingRows[0];

    let newSlug = existing.slug;
    if (body.slug) {
      newSlug = cleanSlug(body.slug);
      const slugCheck = validateSlug(newSlug);
      if (!slugCheck.valid) {
        return NextResponse.json({ error: slugCheck.error }, { status: 400 });
      }

      // Check if slug is used by another post
      const duplicate = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, newSlug), ne(blogPosts.id, id)));
      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: `The slug "/blog/${newSlug}" is already in use by another article.` },
          { status: 409 }
        );
      }
    }

    const now = new Date();
    const status = body.status !== undefined ? body.status : existing.status;
    const publishedAt = body.publishedAt || existing.publishedAt;

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
      !(await hasScheduledBlogPostCapacity(publishedAt, id))
    ) {
      return NextResponse.json(
        {
          error: `Maximum of ${MAX_SCHEDULED_BLOG_POSTS_PER_DAY} posts can be scheduled for ${publishedAt}`,
        },
        { status: 409 }
      );
    }

    // Check if slug changed and create 301 redirect if requested
    if (existing.slug !== newSlug) {
      if (body.createRedirect !== false) {
        const sourcePath = `/blog/${existing.slug}`;
        const destPath = `/blog/${newSlug}`;

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
        note: body.versionNote || (existing.slug !== newSlug ? `Slug changed to /blog/${newSlug}` : `Version ${nextVersionNum} saved`),
      },
    ];

    const plainText = (body.content || existing.content || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 220));

    const updatedPost = {
      title: body.title !== undefined ? body.title.trim() : existing.title,
      slug: newSlug,
      excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
      content: body.content !== undefined ? body.content : existing.content,
      author: body.author !== undefined ? body.author : existing.author,
      category: body.category !== undefined ? body.category : existing.category,
      tags: Array.isArray(body.tags) ? body.tags : existing.tags,
      publishedAt,
      readTime: typeof body.readTime === "number" ? body.readTime : calculatedReadTime,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
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
      ogTitle: body.ogTitle !== undefined ? body.ogTitle : existing.ogTitle,
      ogDescription: body.ogDescription !== undefined ? body.ogDescription : existing.ogDescription,
      ogImage: body.ogImage !== undefined ? body.ogImage : existing.ogImage,
      ogImageAlt: body.ogImageAlt !== undefined ? body.ogImageAlt : existing.ogImageAlt,
      twitterTitle: body.twitterTitle !== undefined ? body.twitterTitle : existing.twitterTitle,
      twitterDescription: body.twitterDescription !== undefined ? body.twitterDescription : existing.twitterDescription,
      twitterImage: body.twitterImage !== undefined ? body.twitterImage : existing.twitterImage,
      faqs: Array.isArray(body.faqs) ? body.faqs : existing.faqs,
      status,
      updatedAt: now,
      versionHistory: updatedHistory,
    };

    await db.update(blogPosts).set(updatedPost).where(eq(blogPosts.id, id));

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/page/[page]", "page");
    revalidatePath("/blog/category/[slug]", "page");
    revalidatePath("/blog/tag/[slug]", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/blog/${existing.slug}`);
    if (newSlug !== existing.slug) revalidatePath(`/blog/${newSlug}`);
    revalidateTag("public-data", "max");
    revalidateTag("runtime-redirects", "max");

    return NextResponse.json({ success: true, post: { id, ...updatedPost } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const existingRows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    const slug = existingRows[0].slug;

    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
