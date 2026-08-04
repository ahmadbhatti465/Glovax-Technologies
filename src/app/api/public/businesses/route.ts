import { NextResponse } from "next/server";
import { db } from "@/db";
import { businesses } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(businesses);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}
