import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { jobPositions } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

type Params = Promise<{ id: string }>;

export async function PUT(request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    await db.update(jobPositions).set(body).where(eq(jobPositions.id, id));
    revalidatePath("/");
    revalidatePath("/career");
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update job position";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Params }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    await db.delete(jobPositions).where(eq(jobPositions.id, id));
    revalidatePath("/");
    revalidatePath("/career");
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete job position" }, { status: 500 });
  }
}
