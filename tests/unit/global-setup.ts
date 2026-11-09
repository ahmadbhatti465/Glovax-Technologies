import fs from "node:fs";
import { createClient } from "@libsql/client";

const DB_FILE = ".vitest.db";

const statements = (file: string) =>
  fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => !line.startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

export default async function setup() {
  for (const suffix of ["", "-wal", "-shm"]) fs.rmSync(DB_FILE + suffix, { force: true });

  const client = createClient({ url: `file:./${DB_FILE}` });
  for (const file of ["drizzle/0008_rate_limits.sql", "drizzle/0009_leads.sql"]) {
    for (const statement of statements(file)) await client.execute(statement);
  }
  await client.execute(`CREATE TABLE redirects (
    id text PRIMARY KEY NOT NULL,
    source text NOT NULL UNIQUE,
    destination text NOT NULL,
    status_code integer DEFAULT 301 NOT NULL,
    created_at integer
  )`);
  client.close();
}
