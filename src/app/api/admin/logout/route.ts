import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await draftMode()).disable();

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
