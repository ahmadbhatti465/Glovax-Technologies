import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/** Returns a same-site path, or null for anything that could redirect off-site. */
function toSafePath(path: string | null, origin: string) {
  if (!path?.startsWith("/")) return null;
  try {
    const url = new URL(path, origin);
    if (url.origin !== origin || url.pathname.startsWith("//")) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const path = toSafePath(request.nextUrl.searchParams.get("path"), request.nextUrl.origin);
  if (!path) {
    return NextResponse.json({ error: "Invalid preview path" }, { status: 400 });
  }

  (await draftMode()).enable();
  redirect(path);
}
