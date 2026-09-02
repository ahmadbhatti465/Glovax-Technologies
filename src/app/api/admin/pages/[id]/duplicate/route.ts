import { NextResponse } from "next/server";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function POST(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(pages).where(eq(pages.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Original page not found" }, { status: 404 });
    }

    const source = rows[0];
    const newId = `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();

    // Generate unique duplicate slug
    let duplicateSlug = cleanSlug(`${source.slug}-copy`);
    let counter = 2;
    while (true) {
      const existing = await db.select().from(pages).where(eq(pages.slug, duplicateSlug));
      if (existing.length === 0) break;
      duplicateSlug = cleanSlug(`${source.slug}-copy-${counter}`);
      counter++;
    }

    const duplicatedPage = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      slug: duplicateSlug,
      status: "draft", // Always set duplicate as draft
      publishedAt: null,
      scheduledAt: null,
      createdAt: now,
      updatedAt: now,
      versionHistory: [
        {
          version: 1,
          title: `${source.title} (Copy)`,
          updatedAt: now.toISOString(),
          author: "Admin",
          note: `Duplicated from "${source.title}" (/${source.slug})`,
        },
      ],
    };

    await db.insert(pages).values(duplicatedPage);

    return NextResponse.json({ success: true, page: duplicatedPage });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to duplicate page";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
