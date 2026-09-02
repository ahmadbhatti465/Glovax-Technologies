import { NextResponse } from "next/server";
import { db } from "@/db";
import { redirects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(redirects).orderBy(desc(redirects.createdAt));
    return NextResponse.json(rows);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch redirects";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const source = body.source?.startsWith("/") ? body.source : `/${body.source}`;
    const destination = body.destination?.startsWith("/") ? body.destination : `/${body.destination}`;
    const statusCode = body.statusCode || 301;

    if (!body.source || !body.destination) {
      return NextResponse.json({ error: "Source and destination are required" }, { status: 400 });
    }

    if (source === destination) {
      return NextResponse.json({ error: "Source and destination cannot be identical (loop risk)" }, { status: 400 });
    }

    const existing = await db.select().from(redirects).where(eq(redirects.source, source));
    if (existing.length > 0) {
      await db
        .update(redirects)
        .set({ destination, statusCode })
        .where(eq(redirects.source, source));
      return NextResponse.json({ success: true, updated: true });
    }

    const id = `redir_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    await db.insert(redirects).values({
      id,
      source,
      destination,
      statusCode,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create redirect";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Redirect ID required" }, { status: 400 });
    }

    await db.delete(redirects).where(eq(redirects.id, id));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete redirect";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
