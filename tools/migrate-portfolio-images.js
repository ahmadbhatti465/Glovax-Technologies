// One-off migration: extract base64 portfolio images from Turso into optimized
// static .webp files under public/images/portfolio/, then point the DB at the
// file path. Run: node tools/migrate-portfolio-images.js
// Requires .env with DATABASE_URL + DATABASE_AUTH_TOKEN (dotenv).
require("dotenv").config();
const { createClient } = require("@libsql/client");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const outDir = path.join("public", "images", "portfolio");
fs.mkdirSync(outDir, { recursive: true });

const SLUGS = {
  "01": "khan-herbals",
  "pureststem-ecommerce": "pureststem",
  "musa-travel-service": "musa-travel",
  "multi-agent-ai-research-system": "multi-agent-ai",
};
// Reuse the already-optimized asset when its dimensions match the DB blob.
const REUSE = { "01": "/images/portfolio/khanherbals.webp" };

(async () => {
  const rows = await db.execute("SELECT id, title, image FROM portfolio_items");

  // Backup all current image values (including base64 blobs) for recovery.
  const backup = rows.rows.map((r) => ({ id: r.id, title: r.title, image: r.image }));
  fs.writeFileSync(path.join("tools", "backup-portfolio-images.json"), JSON.stringify(backup, null, 2));
  console.log(`Backed up ${backup.length} rows -> tools/backup-portfolio-images.json`);

  for (const row of rows.rows) {
    const img = String(row.image || "");
    if (!img.startsWith("data:image/")) continue;
    const id = String(row.id);
    const buf = Buffer.from(img.split(",")[1], "base64");
    const meta = await sharp(buf).metadata();

    const reuse = REUSE[id];
    if (reuse) {
      const existingPath = path.join(outDir, "khanherbals.webp");
      if (fs.existsSync(existingPath)) {
        const eMeta = await sharp(existingPath).metadata();
        if (eMeta.width === meta.width && eMeta.height === meta.height) {
          await db.execute("UPDATE portfolio_items SET image = ? WHERE id = ?", [reuse, id]);
          console.log(`REUSED ${id} -> ${reuse} (dims ${meta.width}x${meta.height} match)`);
          continue;
        }
        console.log(
          `dims MISMATCH ${id}: blob ${meta.width}x${meta.height} vs existing ${eMeta.width}x${eMeta.height} - extracting`
        );
      }
    }

    const slug = SLUGS[id] || id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const webpPath = path.join(outDir, `${slug}.webp`);
    await sharp(buf).webp({ quality: 82 }).toFile(webpPath);
    const target = `/images/portfolio/${slug}.webp`;
    await db.execute("UPDATE portfolio_items SET image = ? WHERE id = ?", [target, id]);
    console.log(
      `EXTRACTED ${id} -> ${target} (blob ${(buf.length / 1024).toFixed(0)}KB -> webp ${(fs.statSync(webpPath).size / 1024).toFixed(0)}KB)`
    );
  }
  console.log("done");
})().catch((e) => {
  console.error("ERR", e.message);
  process.exit(1);
});
