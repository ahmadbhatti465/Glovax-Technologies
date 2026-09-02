import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function POST(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Original article not found" }, { status: 404 });
    }

    const source = rows[0];
    const newId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    let duplicateSlug = cleanSlug(`${source.slug}-copy`);
    let counter = 2;
    while (true) {
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, duplicateSlug));
      if (existing.length === 0) break;
      duplicateSlug = cleanSlug(`${source.slug}-copy-${counter}`);
      counter++;
    }

    const duplicatedPost = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      slug: duplicateSlug,
      status: "draft",
      publishedAt: now.toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
      versionHistory: [
        {
          version: 1,
          title: `${source.title} (Copy)`,
          updatedAt: now.toISOString(),
          author: "Admin",
          note: `Duplicated from "${source.title}" (/blog/${source.slug})`,
        },
      ],
    };

    await db.insert(blogPosts).values(duplicatedPost);

    return NextResponse.json({ success: true, post: duplicatedPost });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to duplicate blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
