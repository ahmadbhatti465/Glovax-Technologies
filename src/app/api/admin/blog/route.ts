import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(blogPosts);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    await db.insert(blogPosts).values({ ...body, updatedAt: new Date() });
    revalidatePath("/");
    revalidatePath("/blog");
    if (body.slug) revalidatePath(`/blog/${body.slug}`);
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
