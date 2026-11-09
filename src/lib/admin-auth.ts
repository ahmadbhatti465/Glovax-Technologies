import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const MIN_SECRET_LENGTH = 32;

export function hasValidSigningSecret() {
  return (process.env.JWT_SECRET?.length ?? 0) >= MIN_SECRET_LENGTH;
}

// Read on every call rather than at module load, so that `next build` can
// import this file without production secrets being present.
function getSigningKey() {
  if (!hasValidSigningSecret()) {
    throw new Error(`JWT_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long`);
  }
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSigningKey());
  return token;
}

export async function verifySession(token: string) {
  if (!hasValidSigningSecret()) {
    console.error("Rejecting admin session: JWT_SECRET is missing or too short");
    return false;
  }
  try {
    const { payload } = await jwtVerify(token, getSigningKey(), { clockTolerance: 60 });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Compares digests rather than the raw strings: timingSafeEqual needs equal
 * lengths, and comparing fixed-size hashes also avoids leaking the length.
 */
export function passwordsMatch(candidate: string, expected: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(candidate), digest(expected));
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value;
}

export async function requireAdmin() {
  const token = await getSessionToken();
  if (!token || !(await verifySession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
