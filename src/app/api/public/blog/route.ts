import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(blogPosts);
    const now = Date.now();
    const posts = rows.filter((post) => {
      const isPublished =
        post.status === "published" ||
        (post.status === "scheduled" &&
          new Date(post.publishedAt).getTime() <= now);
      return isPublished && post.robotsIndex !== false;
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
