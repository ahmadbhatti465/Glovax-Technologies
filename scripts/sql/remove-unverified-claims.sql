-- Removes the "Ministry of Hajj approved" and "60 years of heritage" claims from stored content.
-- Only rewrites those phrases, and is safe to run more than once.
UPDATE businesses SET short_description = REPLACE(short_description, 'brand rooted in 60 years of mountain herbalism heritage, selling', 'brand selling');
UPDATE businesses SET short_description = REPLACE(short_description, 'Ministry of Hajj approved operator serving', 'Travel operator serving');
UPDATE businesses SET description = REPLACE(description, 'is a Ministry of Hajj approved travel operator', 'is a travel operator');
UPDATE portfolio_items SET description = REPLACE(description, 'a natural herbal skincare brand rooted in 60 years of mountain herbalism heritage', 'a natural herbal skincare brand');
UPDATE portfolio_items SET description = REPLACE(description, 'a Ministry of Hajj approved operator based', 'a travel operator based');
