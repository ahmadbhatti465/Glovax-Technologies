import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    await db.update(portfolioItems).set(body).where(eq(portfolioItems.id, id));
    revalidatePath("/");
    revalidatePath("/work");
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update portfolio item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    revalidatePath("/");
    revalidatePath("/work");
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}
