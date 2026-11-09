-- Backs the admin login rate limiter (src/lib/rate-limit.ts).
-- Additive and safe to run more than once. Apply BEFORE deploying the code that uses it.
CREATE TABLE IF NOT EXISTS `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`reset_at` integer NOT NULL
);
