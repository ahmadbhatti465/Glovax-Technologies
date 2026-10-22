import { NextRequest, NextResponse } from "next/server";
import { getRedirect } from "@/lib/data";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const query = request.nextUrl.searchParams;
  if (
    request.nextUrl.pathname === "/blog" &&
    ["page", "q", "sort"].some((key) => query.has(key))
  ) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  try {
    const redirect = await getRedirect(request.nextUrl.pathname);
    if (!redirect) return response;

    const destination = new URL(redirect.destination, request.url);
    switch (redirect.statusCode) {
      case 301:
      case 302:
      case 303:
      case 307:
      case 308:
        return NextResponse.redirect(destination, redirect.statusCode);
      default:
        throw new Error(`Unsupported redirect status code: ${redirect.statusCode}`);
    }
  } catch (error) {
    console.error("Failed to resolve a CMS redirect", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
