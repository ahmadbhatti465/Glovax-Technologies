import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { cleanSlug } from "@/lib/slug";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function POST(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const rows = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Portfolio project not found" }, { status: 404 });
    }

    const original = rows[0];
    const timestampSuffix = Date.now().toString().slice(-4);
    const newTitle = `${original.title} (Copy)`;
    const baseSlug = cleanSlug(original.slug || original.id || original.title);
    const newSlug = `${baseSlug}-copy-${timestampSuffix}`;
    const newId = `${original.id}-copy-${timestampSuffix}`;

    const duplicated = {
      ...original,
      id: newId,
      title: newTitle,
      slug: newSlug,
      status: "draft",
      seoTitle: original.seoTitle ? `${original.seoTitle} (Copy)` : undefined,
      canonicalUrl: null,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(portfolioItems).values(duplicated);

    revalidatePath("/admin/dashboard/portfolio");
    revalidatePath("/work");
    revalidateTag("public-data", "max");

    return NextResponse.json({ success: true, item: duplicated }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to duplicate portfolio project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
