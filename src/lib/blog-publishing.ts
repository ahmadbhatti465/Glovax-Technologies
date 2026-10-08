import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";

export const MAX_SCHEDULED_BLOG_POSTS_PER_DAY = 5;

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
