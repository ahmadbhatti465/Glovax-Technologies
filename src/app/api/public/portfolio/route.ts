import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.status, "published"));
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}
