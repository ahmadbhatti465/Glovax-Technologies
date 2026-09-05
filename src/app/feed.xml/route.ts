import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { siteConfig } from "@/lib/constants";

export const revalidate = 3600; // 1 hour ISR

export async function GET() {
  try {
    const posts = await db
      .select({
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        category: blogPosts.category,
        author: blogPosts.author,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
        status: blogPosts.status,
        robotsIndex: blogPosts.robotsIndex,
      })
      .from(blogPosts);

    const publishedPosts = posts
      .filter((p) => (p.status || "published") === "published" && p.robotsIndex !== false)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const xmlItems = publishedPosts
      .map((post) => {
        const postUrl = `${siteConfig.url}/blog/${post.slug}`;
        const pubDate = new Date(post.publishedAt).toUTCString();
        const escapeXml = (unsafe: string) =>
          unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");

        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <category>${escapeXml(post.category || "Technology")}</category>
      <author>${escapeXml(post.author || siteConfig.name)}</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
      })
      .join("\n");

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} Blog &amp; Engineering Insights</title>
    <link>${siteConfig.url}/blog</link>
    <description>${siteConfig.description}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
${xmlItems}
  </channel>
</rss>`;

    return new Response(rssFeed, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    return new Response("Error generating RSS feed", { status: 500 });
  }
}
