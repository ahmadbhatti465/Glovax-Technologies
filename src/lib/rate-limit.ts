import { createHash } from "node:crypto";
import { eq, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

interface RateLimitOptions {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Vercel overwrites these headers, so clients cannot spoof them there. */
export function getClientIp(headers: Headers) {
  return (
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// Identifiers are hashed so that the table never stores visitors' IP addresses.
function bucketKey(scope: string, identifier: string) {
  return `${scope}:${createHash("sha256").update(identifier).digest("hex")}`;
}

/**
 * Counts an attempt and reports whether it is within the limit. The count is a
 * single atomic upsert, so parallel requests across serverless instances
 * cannot slip past it. Throws if the database is unavailable; callers decide
 * whether to fail open or closed.
 */
export async function consumeRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const newResetAt = now + windowMs;

  const [bucket] = await db
    .insert(rateLimits)
    .values({ key: bucketKey(scope, identifier), count: 1, resetAt: newResetAt })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.resetAt} <= ${now} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        resetAt: sql`CASE WHEN ${rateLimits.resetAt} <= ${now} THEN ${newResetAt} ELSE ${rateLimits.resetAt} END`,
      },
    })
    .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt });

  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

/** Clears one bucket and removes any expired ones so the table stays small. */
export async function resetRateLimit(scope: string, identifier: string) {
  await db
    .delete(rateLimits)
    .where(or(eq(rateLimits.key, bucketKey(scope, identifier)), lte(rateLimits.resetAt, Date.now())));
}
