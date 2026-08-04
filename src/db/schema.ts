import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  features: text("features", { mode: "json" }).$type<string[]>().notNull(),
  icon: text("icon").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const portfolioItems = sqliteTable("portfolio_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  link: text("link"),
  results: text("results", { mode: "json" }).$type<string[]>().notNull(),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  rating: integer("rating").notNull().default(5),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const teamMembers = sqliteTable("team_members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  bio: text("bio").notNull(),
  expertise: text("expertise", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  publishedAt: text("published_at").notNull(),
  readTime: integer("read_time").notNull().default(5),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const jobPositions = sqliteTable("job_positions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  experience: text("experience").notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities", { mode: "json" }).$type<string[]>().notNull(),
  requirements: text("requirements", { mode: "json" }).$type<string[]>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value", { mode: "json" }).$type<unknown>().notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const businesses = sqliteTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  hours: text("hours", { mode: "json" }).$type<{ day: string; hours: string }[]>().notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  image: text("image"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  isRemote: integer("is_remote", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
