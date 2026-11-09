import { NextRequest, NextResponse } from "next/server";
import { blogPostExists, getRedirectForProxy } from "@/lib/data";

const BLOG_POST_PATH = /^\/blog\/([^/]+)\/?$/;

const GONE_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Article removed | Glovax Technologies</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#f5f5f7;font-family:system-ui,sans-serif;text-align:center;padding:24px}
h1{font-size:28px;margin:0 0 12px}
p{color:#a1a1aa;margin:0 0 24px}
a{color:#1edac6;margin:0 12px}
</style>
</head>
<body>
<main>
<h1>This article has been removed</h1>
<p>It is no longer available on Glovax Technologies.</p>
<a href="/">Home</a><a href="/services">Our services</a><a href="/contact">Contact us</a>
</main>
</body>
</html>`;

function goneResponse() {
  return new NextResponse(GONE_PAGE, {
    status: 410,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, searchParams: query } = request.nextUrl;
  if (pathname === "/blog" && ["page", "q", "sort"].some((key) => query.has(key))) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // Any failure falls through to the normal page. A database outage must never
  // tell search engines that every article is permanently gone.
  try {
    const redirect = await getRedirectForProxy(pathname);
    if (!redirect) {
      const slug = pathname.match(BLOG_POST_PATH)?.[1];
      if (slug && !(await blogPostExists(decodeURIComponent(slug)))) return goneResponse();
      return response;
    }

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
    console.error("Failed to resolve a CMS redirect or blog post", error);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
