/**
 * Safe directory seeding — inserts ONLY the businesses table.
 *
 * Unlike `seed.ts` (which deletes services/portfolio/testimonials/blog before
 * re-inserting, and must never run against a DB with real admin content), this
 * script touches only the new `businesses` table, so it is safe to run against
 * the live Turso database to (re)populate the directory.
 *
 * Usage:
 *   npx dotenv -e .env -- tsx tools/seed-businesses.ts   # remote Turso
 *   npm run db:seed                                      # fresh local DB (full seed)
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema";
import { businesses as seedBusinesses } from "../src/data/businesses";

const url = process.env.DATABASE_URL || "file:./sqlite.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

const client = createClient({
  url,
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

const db = drizzle(client, { schema });

async function main() {
  console.log(
    `Seeding businesses into ${isTurso ? "Turso (remote)" : `local (${url})`}...`
  );
  // Businesses is the only table touched — clearing it first keeps this idempotent.
  await db.delete(schema.businesses);
  await db.insert(schema.businesses).values(seedBusinesses);
  console.log(`Inserted ${seedBusinesses.length} directory listings.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
