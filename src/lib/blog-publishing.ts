import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export const MAX_SCHEDULED_BLOG_POSTS_PER_DAY = 5;

/** Published, or scheduled with a publish date that has passed. */
export function isBlogPostLive(post: { status: string | null; publishedAt: string }, now = Date.now()) {
  const status = post.status || "published";
  return status === "published" || (status === "scheduled" && new Date(post.publishedAt).getTime() <= now);
}

export async function hasScheduledBlogPostCapacity(
  publishDate: string,
  excludePostId?: string
): Promise<boolean> {
  const conditions = [
    eq(blogPosts.status, "scheduled"),
    eq(blogPosts.publishedAt, publishDate),
  ];
  if (excludePostId) conditions.push(ne(blogPosts.id, excludePostId));

  const scheduledPosts = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(and(...conditions));

  return scheduledPosts.length < MAX_SCHEDULED_BLOG_POSTS_PER_DAY;
}
