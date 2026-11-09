import { NextResponse } from "next/server";
import { createSession, hasValidSigningSecret, passwordsMatch } from "@/lib/admin-auth";
import { consumeRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_SCOPE = "admin-login";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !hasValidSigningSecret()) {
    console.error("Admin login is disabled: ADMIN_PASSWORD or JWT_SECRET is not configured correctly");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (typeof password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ip = getClientIp(request.headers);

  // Fails closed: without a working limiter, password guessing would be unthrottled.
  let rateLimit;
  try {
    rateLimit = await consumeRateLimit({
      scope: RATE_LIMIT_SCOPE,
      identifier: ip,
      limit: MAX_ATTEMPTS,
      windowMs: WINDOW_MS,
    });
  } catch (error) {
    console.error("Admin login rate limiter is unavailable", error);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again shortly." },
      { status: 503 }
    );
  }

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } }
    );
  }

  if (!passwordsMatch(password, adminPassword)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await resetRateLimit(RATE_LIMIT_SCOPE, ip).catch((error) => {
    console.error("Failed to reset the admin login rate limit", error);
  });

  const token = await createSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 8 * 60 * 60,
    path: "/",
  });

  return response;
}
