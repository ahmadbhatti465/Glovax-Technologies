import { NextResponse } from "next/server";
import { getBusinesses } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getBusinesses());
}
