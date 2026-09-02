CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`page_type` text DEFAULT 'standard' NOT NULL,
	`featured_image` text,
	`featured_image_alt` text,
	`featured_image_title` text,
	`featured_image_caption` text,
	`seo_title` text,
	`meta_description` text,
	`focus_keyword` text,
	`secondary_keywords` text DEFAULT '[]' NOT NULL,
	`canonical_url` text,
	`robots_index` integer DEFAULT true NOT NULL,
	`robots_follow` integer DEFAULT true NOT NULL,
	`include_in_sitemap` integer DEFAULT true NOT NULL,
	`sitemap_priority` real DEFAULT 0.8 NOT NULL,
	`change_frequency` text DEFAULT 'monthly' NOT NULL,
	`og_title` text,
	`og_description` text,
	`og_image` text,
	`og_image_alt` text,
	`twitter_title` text,
	`twitter_description` text,
	`twitter_image` text,
	`schema_type` text DEFAULT 'WebPage' NOT NULL,
	`faqs` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`author` text DEFAULT 'Glovax Team' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`read_time` integer DEFAULT 3 NOT NULL,
	`scheduled_at` integer,
	`published_at` integer,
	`created_at` integer,
	`updated_at` integer,
	`version_history` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`destination` text NOT NULL,
	`status_code` integer DEFAULT 301 NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `redirects_source_unique` ON `redirects` (`source`);