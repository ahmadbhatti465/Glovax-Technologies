import { draftMode } from "next/headers";
import { getSessionToken, verifySession } from "@/lib/admin-auth";

/**
 * True only for a browser in Next.js draft mode that also holds a valid admin
 * session. Cookies are read only once draft mode is on, so ordinary visitors
 * keep getting the statically cached page.
 */
export async function isAdminPreview() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return false;

  const token = await getSessionToken();
  return Boolean(token && (await verifySession(token)));
}
