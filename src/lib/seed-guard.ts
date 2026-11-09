type Env = Record<string, string | undefined>;

const DEV_HOST_LABEL = /(^|[-.])(dev|test|staging)([-.]|$)/;

/** An allowlist: any database not clearly marked as non-production is refused. */
export function isDevDatabaseUrl(url: string) {
  if (url.startsWith("file:")) return true;
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1" || DEV_HOST_LABEL.test(hostname);
  } catch {
    return false;
  }
}

/** seed.ts deletes and re-inserts whole tables, so it must never reach production. */
export function assertSeedAllowed(env: Env) {
  if (env.ALLOW_SEED !== "true") {
    throw new Error("Refusing to seed: set ALLOW_SEED=true to confirm this is a development database.");
  }
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") {
    throw new Error("Refusing to seed: this is a production environment.");
  }
  if (!isDevDatabaseUrl(env.DATABASE_URL || "file:./sqlite.db")) {
    throw new Error("Refusing to seed: DATABASE_URL is not a local file or a dev/test/staging host.");
  }
}
