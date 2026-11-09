import { isValidExternalUrl } from "@/lib/utils";

// Number ranges reserved for fiction: US 555-xxxx and UK 020 7946 0xxx.
const FICTIONAL_PHONE_PATTERNS = [/^1?\d{3}555\d{4}$/, /^(?:44|0)207946\d{4}$/];

export function hasFictionalPhone(phone?: string | null) {
  const digits = (phone ?? "").replace(/\D/g, "");
  return FICTIONAL_PHONE_PATTERNS.some((pattern) => pattern.test(digits));
}

/**
 * Listings stay in the database but are only shown once they have a working
 * website and a real phone number, so filling those in publishes them.
 */
export function isPublishableListing(listing: { phone?: string | null; website?: string | null }) {
  return isValidExternalUrl(listing.website) && !hasFictionalPhone(listing.phone);
}
