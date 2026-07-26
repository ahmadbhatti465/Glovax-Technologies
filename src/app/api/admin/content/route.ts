import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(siteContent);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    await db.insert(siteContent).values(body).onConflictDoUpdate({
      target: siteContent.key,
      set: { value: body.value, updatedAt: new Date() },
    });
    revalidatePath("/");
    if (body.key) revalidateTag(`content:${body.key}`, "max");
    revalidateTag("public-data", "max");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
