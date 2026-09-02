ALTER TABLE `blog_posts` ADD `featured_image` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `featured_image_alt` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `featured_image_title` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `featured_image_caption` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `seo_title` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `meta_description` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `focus_keyword` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `secondary_keywords` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `canonical_url` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `robots_index` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `robots_follow` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `og_title` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `og_description` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `og_image` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `og_image_alt` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `twitter_title` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `twitter_description` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `twitter_image` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `faqs` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `status` text DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `version_history` text DEFAULT '[]' NOT NULL;