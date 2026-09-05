import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema";
import { new100Blogs } from "./blogs-data";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const url = process.env.DATABASE_URL || "file:./sqlite.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

const client = createClient({
  url,
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

const db = drizzle(client, { schema });

async function withRetry<T>(fn: () => Promise<T>, attempts = 5, delay = 500): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        console.log(`⚠️ Network retry attempt ${i + 1}/${attempts} after ${delay * (i + 1)}ms...`);
        await new Promise((res) => setTimeout(res, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}

async function seed100Blogs() {
  console.log("=================================================");
  console.log("🚀 GLOVAX TECHNOLOGIES: 100 SEO BLOG SEEDER 🚀");
  console.log("=================================================");
  console.log(`Connecting to database: ${url.replace(/:[^:]*@/, ":***@")}`);
  console.log(`Total new blog posts prepared: ${new100Blogs.length}`);

  try {
    const existingPosts = await withRetry(() => db.select().from(schema.blogPosts));
    const existingSlugs = new Set(existingPosts.map((p) => p.slug));
    const existingIds = new Set(existingPosts.map((p) => p.id));

    console.log(`Found ${existingPosts.length} existing blog posts in database.`);

    let insertedCount = 0;
    let updatedCount = 0;

    for (let i = 0; i < new100Blogs.length; i++) {
      const blog = new100Blogs[i];
      const blogNumber = String(i + 1).padStart(3, "0");

      const record = {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        author: blog.author || "Glovax Team",
        category: blog.category,
        tags: blog.tags,
        publishedAt: blog.publishedAt,
        readTime: blog.readTime || 7,
        featured: blog.featured || false,
        featuredImage: blog.featuredImage || "/images/glovax-og.png",
        featuredImageAlt: blog.featuredImageAlt || blog.title,
        featuredImageTitle: blog.featuredImageTitle || null,
        featuredImageCaption: blog.featuredImageCaption || null,
        seoTitle: blog.seoTitle || `${blog.title} | Glovax Technologies`,
        metaDescription: blog.metaDescription || blog.excerpt.slice(0, 160),
        focusKeyword: blog.focusKeyword || null,
        secondaryKeywords: blog.secondaryKeywords || [],
        canonicalUrl: blog.canonicalUrl || `https://glovaxtechnologies.com/blog/${blog.slug}`,
        robotsIndex: blog.robotsIndex !== false,
        robotsFollow: blog.robotsFollow !== false,
        ogTitle: blog.ogTitle || blog.seoTitle || blog.title,
        ogDescription: blog.ogDescription || blog.metaDescription || blog.excerpt,
        ogImage: blog.ogImage || blog.featuredImage || "/images/glovax-og.png",
        ogImageAlt: blog.ogImageAlt || blog.featuredImageAlt || blog.title,
        twitterTitle: blog.twitterTitle || blog.seoTitle || blog.title,
        twitterDescription: blog.twitterDescription || blog.metaDescription || blog.excerpt,
        twitterImage: blog.twitterImage || blog.featuredImage || "/images/glovax-og.png",
        faqs: blog.faqs || [],
        status: (blog.status as "published" | "draft" | "scheduled" | "archived") || "published",
        createdAt: new Date(),
        updatedAt: new Date(),
        versionHistory: [],
      };

      if (existingSlugs.has(blog.slug) || existingIds.has(blog.id)) {
        await withRetry(() =>
          db
            .update(schema.blogPosts)
            .set(record)
            .where(eq(schema.blogPosts.slug, blog.slug))
        );
        updatedCount++;
        console.log(`[${blogNumber}/100] 🔄 Updated: ${blog.title.slice(0, 60)}...`);
      } else {
        await withRetry(() => db.insert(schema.blogPosts).values(record));
        existingSlugs.add(blog.slug);
        existingIds.add(blog.id);
        insertedCount++;
        console.log(`[${blogNumber}/100] ✅ Inserted: ${blog.title.slice(0, 60)}...`);
      }

      // Small pause between operations to avoid connection saturation
      await new Promise((res) => setTimeout(res, 60));
    }

    const totalPosts = await withRetry(() => db.select().from(schema.blogPosts));
    console.log("=================================================");
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY! 🎉");
    console.log(`✅ Newly Inserted: ${insertedCount}`);
    console.log(`🔄 Updated: ${updatedCount}`);
    console.log(`📊 Total Blogs in Database: ${totalPosts.length}`);
    console.log("=================================================");

    const categoryCounts: Record<string, number> = {};
    totalPosts.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });
    console.log("Category breakdown in database:");
    console.table(categoryCounts);

    client.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding 100 blog posts:", error);
    client.close();
    process.exit(1);
  }
}

seed100Blogs();
