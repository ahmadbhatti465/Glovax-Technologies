import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { siteConfig } from "@/lib/constants";

const leadSchema = z.object({
  email: z.string().email(),
  message: z.string().max(500).optional().default(""),
});

// Lead capture for the chat concierge. Best-effort: if RESEND_API_KEY is not
// configured, it still returns success so the chat flow never breaks.
export async function POST(request: Request) {
  try {
    const body = leadSchema.parse(await request.json());
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: true, message: "Lead noted." });
    }

    const owner = process.env.OWNER_EMAIL || siteConfig.email;
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `${siteConfig.name} <onboarding@resend.dev>`,
      to: owner,
      replyTo: body.email,
      subject: `Chat lead: ${body.email}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #111827;">
          <h1 style="font-size: 20px; font-weight: 700; color: #1EDAC6; margin: 0 0 16px 0;">New chat lead</h1>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px 0;">A visitor captured by the AI concierge left their details:</p>
          <table style="width: 100%; font-size: 14px; background: #f9fafb; border-radius: 12px; padding: 16px;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: 500;">${body.email}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Last message</td><td style="padding: 6px 0;">${body.message || "—"}</td></tr>
          </table>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Reach out within 24 hours to maximize the lead.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }
}
