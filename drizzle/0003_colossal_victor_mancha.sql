CREATE TABLE `businesses` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`short_description` text NOT NULL,
	`description` text NOT NULL,
	`rating` real DEFAULT 4.5 NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`address` text,
	`phone` text,
	`website` text,
	`hours` text NOT NULL,
	`tags` text NOT NULL,
	`image` text,
	`featured` integer DEFAULT false NOT NULL,
	`is_remote` integer DEFAULT false NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_slug_unique` ON `businesses` (`slug`);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `updated_at` integer;