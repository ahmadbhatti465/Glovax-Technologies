#!/usr/bin/env node
/**
 * One-off fix: remove the broken "localhost:8501" link from the
 * multi-agent-ai-research-system portfolio record in the production DB.
 *
 * Google resolves href="localhost:8501" as https://www.glovaxtechnologies.com/
 * localhost:8501 → 404, which blocks indexing. This clears the field so no
 * "Visit Website" button renders (the project is an internal one with no live
 * site). Safe: only updates the one record, and only when it still equals
 * "localhost:8501".
 *
 * Usage:  node tools/fix-portfolio-link.cjs
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Load DATABASE_URL / DATABASE_AUTH_TOKEN from .env (no --env-file needed).
function loadEnv(file) {
  const out = {};
  const raw = fs.readFileSync(file, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function main() {
  const env = loadEnv(path.join(__dirname, "..", ".env"));
  const url = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;
  if (!url) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
  }
  if (!url.startsWith("libsql://") && !url.startsWith("https://")) {
    console.error("ERROR: DATABASE_URL is not a Turso URL — refusing to touch a local/other DB.");
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  const before = await db.execute(
    "SELECT id, title, link FROM portfolio_items WHERE id = 'multi-agent-ai-research-system'"
  );
  console.log("Before:", JSON.stringify(before.rows));

  if (before.rows.length === 0) {
    console.log("Record not found — nothing to do.");
    return;
  }
  if (before.rows[0].link !== "localhost:8501") {
    console.log("link is already", JSON.stringify(before.rows[0].link), "— nothing to do.");
    return;
  }

  const result = await db.execute(
    "UPDATE portfolio_items SET link = '' WHERE id = 'multi-agent-ai-research-system' AND link = 'localhost:8501'"
  );
  console.log("Rows updated:", result.rowsAffected);

  const after = await db.execute(
    "SELECT id, title, link FROM portfolio_items WHERE id = 'multi-agent-ai-research-system'"
  );
  console.log("After:", JSON.stringify(after.rows));
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
