import { NextResponse } from "next/server";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(blogPosts);
    const posts = rows.filter((post) => {
      return (
        post.status === "published" &&
        new Date(post.publishedAt).getTime() <= Date.now() &&
        post.robotsIndex !== false
      );
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}
