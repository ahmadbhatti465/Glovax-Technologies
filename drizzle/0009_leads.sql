-- Stores every contact form, chat, homepage and newsletter submission.
-- Additive and safe to run more than once. Apply BEFORE deploying the code that uses it.
CREATE TABLE IF NOT EXISTS `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`company` text,
	`service` text,
	`message` text,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`email_error` text,
	`created_at` integer NOT NULL
);
