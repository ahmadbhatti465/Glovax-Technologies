import "dotenv/config";
import { createClient } from "@libsql/client";

const url = process.env.DATABASE_URL || "file:./sqlite.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

const client = createClient({
  url,
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

const columnsToAdd: { name: string; sql: string }[] = [
  { name: "slug", sql: "ALTER TABLE `portfolio_items` ADD `slug` text" },
  { name: "short_description", sql: "ALTER TABLE `portfolio_items` ADD `short_description` text" },
  { name: "client_website", sql: "ALTER TABLE `portfolio_items` ADD `client_website` text" },
  { name: "industry", sql: "ALTER TABLE `portfolio_items` ADD `industry` text" },
  { name: "services", sql: "ALTER TABLE `portfolio_items` ADD `services` text DEFAULT '[]' NOT NULL" },
  { name: "timeline", sql: "ALTER TABLE `portfolio_items` ADD `timeline` text" },
  { name: "project_year", sql: "ALTER TABLE `portfolio_items` ADD `project_year` text" },
  { name: "location", sql: "ALTER TABLE `portfolio_items` ADD `location` text" },
  { name: "status", sql: "ALTER TABLE `portfolio_items` ADD `status` text DEFAULT 'published' NOT NULL" },
  { name: "challenge", sql: "ALTER TABLE `portfolio_items` ADD `challenge` text" },
  { name: "solution", sql: "ALTER TABLE `portfolio_items` ADD `solution` text" },
  { name: "process", sql: "ALTER TABLE `portfolio_items` ADD `process` text DEFAULT '[]' NOT NULL" },
  { name: "key_features", sql: "ALTER TABLE `portfolio_items` ADD `key_features` text DEFAULT '[]' NOT NULL" },
  { name: "testimonial_quote", sql: "ALTER TABLE `portfolio_items` ADD `testimonial_quote` text" },
  { name: "testimonial_author", sql: "ALTER TABLE `portfolio_items` ADD `testimonial_author` text" },
  { name: "testimonial_role", sql: "ALTER TABLE `portfolio_items` ADD `testimonial_role` text" },
  { name: "testimonial_company", sql: "ALTER TABLE `portfolio_items` ADD `testimonial_company` text" },
  { name: "testimonial_rating", sql: "ALTER TABLE `portfolio_items` ADD `testimonial_rating` integer DEFAULT 5" },
  { name: "image_alt", sql: "ALTER TABLE `portfolio_items` ADD `image_alt` text" },
  { name: "image_title", sql: "ALTER TABLE `portfolio_items` ADD `image_title` text" },
  { name: "image_caption", sql: "ALTER TABLE `portfolio_items` ADD `image_caption` text" },
  { name: "gallery", sql: "ALTER TABLE `portfolio_items` ADD `gallery` text DEFAULT '[]' NOT NULL" },
  { name: "related_projects", sql: "ALTER TABLE `portfolio_items` ADD `related_projects` text DEFAULT '[]' NOT NULL" },
  { name: "seo_title", sql: "ALTER TABLE `portfolio_items` ADD `seo_title` text" },
  { name: "meta_description", sql: "ALTER TABLE `portfolio_items` ADD `meta_description` text" },
  { name: "focus_keyword", sql: "ALTER TABLE `portfolio_items` ADD `focus_keyword` text" },
  { name: "secondary_keywords", sql: "ALTER TABLE `portfolio_items` ADD `secondary_keywords` text DEFAULT '[]' NOT NULL" },
  { name: "canonical_url", sql: "ALTER TABLE `portfolio_items` ADD `canonical_url` text" },
  { name: "robots_index", sql: "ALTER TABLE `portfolio_items` ADD `robots_index` integer DEFAULT 1 NOT NULL" },
  { name: "robots_follow", sql: "ALTER TABLE `portfolio_items` ADD `robots_follow` integer DEFAULT 1 NOT NULL" },
  { name: "include_in_sitemap", sql: "ALTER TABLE `portfolio_items` ADD `include_in_sitemap` integer DEFAULT 1 NOT NULL" },
  { name: "sitemap_priority", sql: "ALTER TABLE `portfolio_items` ADD `sitemap_priority` real DEFAULT 0.8 NOT NULL" },
  { name: "change_frequency", sql: "ALTER TABLE `portfolio_items` ADD `change_frequency` text DEFAULT 'monthly' NOT NULL" },
  { name: "og_title", sql: "ALTER TABLE `portfolio_items` ADD `og_title` text" },
  { name: "og_description", sql: "ALTER TABLE `portfolio_items` ADD `og_description` text" },
  { name: "og_image", sql: "ALTER TABLE `portfolio_items` ADD `og_image` text" },
  { name: "og_image_alt", sql: "ALTER TABLE `portfolio_items` ADD `og_image_alt` text" },
  { name: "twitter_title", sql: "ALTER TABLE `portfolio_items` ADD `twitter_title` text" },
  { name: "twitter_description", sql: "ALTER TABLE `portfolio_items` ADD `twitter_description` text" },
  { name: "twitter_image", sql: "ALTER TABLE `portfolio_items` ADD `twitter_image` text" },
  { name: "schema_type", sql: "ALTER TABLE `portfolio_items` ADD `schema_type` text DEFAULT 'CreativeWork' NOT NULL" },
  { name: "published_at", sql: "ALTER TABLE `portfolio_items` ADD `published_at` text" },
  { name: "updated_at", sql: "ALTER TABLE `portfolio_items` ADD `updated_at` integer" },
];

async function run() {
  console.log("Checking table info for portfolio_items on", url);
  await client.execute(`
    CREATE TABLE IF NOT EXISTS \`portfolio_items\` (
      \`id\` text PRIMARY KEY NOT NULL,
      \`title\` text NOT NULL,
      \`client\` text NOT NULL,
      \`category\` text NOT NULL,
      \`description\` text NOT NULL,
      \`link\` text,
      \`results\` text NOT NULL,
      \`technologies\` text NOT NULL,
      \`image\` text,
      \`featured\` integer DEFAULT 0 NOT NULL,
      \`created_at\` integer
    );
  `);
  const tableInfo = await client.execute("PRAGMA table_info(portfolio_items);");
  const existingCols = new Set(tableInfo.rows.map((r) => String(r.name)));

  for (const col of columnsToAdd) {
    if (!existingCols.has(col.name)) {
      console.log(`Adding column ${col.name}...`);
      try {
        await client.execute(col.sql);
        console.log(`Added column ${col.name}`);
      } catch (err) {
        console.error(`Error adding column ${col.name}:`, err);
      }
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  }

  // Populate slug with id for existing records if null
  await client.execute("UPDATE portfolio_items SET slug = id WHERE slug IS NULL OR slug = '';");
  console.log("Migration complete!");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
