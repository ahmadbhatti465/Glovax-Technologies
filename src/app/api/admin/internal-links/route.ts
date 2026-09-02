import { NextResponse } from "next/server";
import { getInternalLinkTargets } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    const allTargets = await getInternalLinkTargets();
    const filtered = query
      ? allTargets.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.url.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        )
      : allTargets;

    return NextResponse.json(filtered);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch internal link targets";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
