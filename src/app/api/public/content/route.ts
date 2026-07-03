import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteContent } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (key) {
      const row = await db.select().from(siteContent).where(eq(siteContent.key, key)).get();
      if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(row);
    }
    const rows = await db.select().from(siteContent);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
