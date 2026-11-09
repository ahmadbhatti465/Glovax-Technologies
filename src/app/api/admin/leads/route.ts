import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { reportError } from "@/lib/monitoring";

const MAX_ROWS = 500;

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(MAX_ROWS);
    return NextResponse.json(rows);
  } catch (error) {
    await reportError("Failed to load leads", error);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
