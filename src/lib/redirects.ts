import { eq } from "drizzle-orm";
import { db } from "@/db";
import { redirects } from "@/db/schema";

interface RedirectEdge {
  source: string;
  destination: string;
}

const normalize = (path: string) =>
  (path.startsWith("/") || /^https?:/.test(path) ? path : `/${path}`).replace(/\/+$/, "") || "/";

const newRedirectId = () => `redir_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

function leadsIntoLoop(edges: RedirectEdge[], start: string) {
  const next = new Map(edges.map((edge) => [normalize(edge.source), normalize(edge.destination)]));
  const seen = new Set<string>();
  let current: string | undefined = normalize(start);
  while (current !== undefined) {
    if (seen.has(current)) return true;
    seen.add(current);
    current = next.get(current);
  }
  return false;
}

/** True if following this source would never reach a real page. */
export function isRedirectLoop(rows: RedirectEdge[], source: string) {
  return leadsIntoLoop(rows, source);
}

/** Saves a redirect, or returns false if it would point to itself or form a cycle. */
export async function saveRedirect(source: string, destination: string, statusCode = 301) {
  const rows = await db.select().from(redirects);
  const others = rows.filter((row) => normalize(row.source) !== normalize(source));
  if (leadsIntoLoop([...others, { source, destination }], source)) return false;

  await db
    .insert(redirects)
    .values({ id: newRedirectId(), source, destination, statusCode, createdAt: new Date() })
    .onConflictDoUpdate({ target: redirects.source, set: { destination, statusCode } });
  return true;
}

/**
 * Updates redirects after a slug changes from `from` to `to`. The new URL must
 * never stay a redirect source: renaming A to B and back to A used to leave
 * both A to B and B to A in the table, sending visitors round in a loop.
 */
export async function recordSlugRename(from: string, to: string, createRedirect: boolean) {
  const clearNewUrl = db.delete(redirects).where(eq(redirects.source, to));
  if (!createRedirect) {
    await clearNewUrl;
    return;
  }

  await db.batch([
    clearNewUrl,
    // Older URLs go straight to the new one instead of through a chain.
    db.update(redirects).set({ destination: to }).where(eq(redirects.destination, from)),
    db
      .insert(redirects)
      .values({ id: newRedirectId(), source: from, destination: to, statusCode: 301, createdAt: new Date() })
      .onConflictDoUpdate({ target: redirects.source, set: { destination: to, statusCode: 301 } }),
  ]);
}
