import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { isBlogPostLive } from "@/lib/blog-publishing";

export async function GET() {
  try {
    const rows = await db.select().from(blogPosts);
    const posts = rows.filter((post) => {
      return (
        isBlogPostLive(post) &&
        new Date(post.publishedAt).getTime() <= Date.now() &&
        post.robotsIndex !== false
      );
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
