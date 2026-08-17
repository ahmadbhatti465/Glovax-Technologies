// Reads the expanded articles written by the content agents, validates them,
// and updates the Turso blog_posts content (with a backup of the originals).
// Safe: only UPDATEs content + updated_at by slug; never deletes or re-inserts.
const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const DIR = __dirname;
const MIN_WORDS = 1200;
const DRY_RUN = process.argv.includes("--dry-run");

(async () => {
  const orig = JSON.parse(fs.readFileSync(path.join(DIR, "posts.json"), "utf8"));
  const slugs = Object.keys(orig);
  const results = [];

  for (const slug of slugs) {
    const file = path.join(DIR, `${slug}.md`);
    if (!fs.existsSync(file)) {
      results.push({ slug, ok: false, reason: "missing .md file" });
      continue;
    }
    const content = fs.readFileSync(file, "utf8").trim();
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const hasFaq = /^## FAQ/m.test(content);
    // Ignore everything inside fenced code blocks for the structural checks —
    // `#` comments and inline tags there are code, not headings/HTML.
    const outsideCode = content.replace(/```[\s\S]*?```/g, "");
    // Only flag real block-level HTML (a tag at line start). Inline tags such as
    // `<header>` inside backtick examples are literal text for our renderer.
    const hasHtml = /^\s*<(div|p|span|a|img|section|article|ul|ol|li|h1|h2|h3|script|style|figure|table)\b/mi.test(outsideCode);
    const hasH1 = /^# /m.test(outsideCode);
    const fences = (content.match(/```/g) || []).length;
    const unbalancedFences = fences % 2 !== 0;
    if (wordCount < MIN_WORDS) {
      results.push({ slug, ok: false, reason: `only ${wordCount} words` });
      continue;
    }
    if (!hasFaq) {
      results.push({ slug, ok: false, reason: "missing ## FAQ section" });
      continue;
    }
    if (hasHtml) {
      results.push({ slug, ok: false, reason: "contains raw HTML" });
      continue;
    }
    if (hasH1) {
      results.push({ slug, ok: false, reason: "contains an H1 heading" });
      continue;
    }
    if (unbalancedFences) {
      results.push({ slug, ok: false, reason: "unbalanced ``` code fences" });
      continue;
    }
    results.push({ slug, ok: true, words: wordCount, hasFaq, content });
  }

  const valid = results.filter((r) => r.ok);
  const invalid = results.filter((r) => !r.ok);
  console.log(`\n=== VALIDATION ===\n${valid.length}/${results.length} passed, ${invalid.length} failed`);
  for (const r of invalid) console.log(`  FAIL  ${r.slug}: ${r.reason}`);
  for (const r of valid) console.log(`  OK    ${r.slug}  (${r.words} words)`);

  if (invalid.length > 0) {
    console.log("\nAborting DB update until all files pass validation.");
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log("\nDRY-RUN — all validations passed, no DB changes made.");
    process.exit(0);
  }

  // Backup originals (content only) for reversibility.
  const backup = {};
  for (const slug of slugs) backup[slug] = orig[slug].content;
  fs.writeFileSync(path.join(DIR, "backup-content.json"), JSON.stringify(backup, null, 2));
  console.log(`Backed up original content to ${path.join(DIR, "backup-content.json")}`);

  // Update production DB.
  const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
  // Drizzle maps integer("updated_at", { mode: "timestamp" }) to Unix epoch
  // SECONDS (reads new Date(value * 1000)). Write seconds, not an ISO string.
  const now = Math.floor(Date.now() / 1000);
  for (const r of valid) {
    await c.execute("UPDATE blog_posts SET content = ?, updated_at = ? WHERE slug = ?", [r.content, now, r.slug]);
    console.log(`Updated ${r.slug}`);
  }
  console.log(`\nDONE: ${valid.length} posts updated.`);
  process.exit(0);
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
