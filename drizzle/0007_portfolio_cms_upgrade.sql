ALTER TABLE `portfolio_items` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `short_description` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `client_website` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `industry` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `services` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `timeline` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `project_year` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `location` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `status` text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `challenge` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `solution` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `process` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `key_features` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `testimonial_quote` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `testimonial_author` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `testimonial_role` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `testimonial_company` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `testimonial_rating` integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `image_alt` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `image_title` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `image_caption` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `gallery` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `related_projects` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `seo_title` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `meta_description` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `focus_keyword` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `secondary_keywords` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `canonical_url` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `robots_index` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `robots_follow` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `include_in_sitemap` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `sitemap_priority` real DEFAULT 0.8 NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `change_frequency` text DEFAULT 'monthly' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `og_title` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `og_description` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `og_image` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `og_image_alt` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `twitter_title` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `twitter_description` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `twitter_image` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `schema_type` text DEFAULT 'CreativeWork' NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `published_at` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `updated_at` integer;
