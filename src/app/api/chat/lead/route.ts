import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/constants";
import { escapeHtml, ownerEmail, sendEmail } from "@/lib/email";
import { protectSubmission } from "@/lib/form-protection";
import { HONEYPOT_FIELD, leadSchema, protectionFields } from "@/lib/lead-schemas";
import { recordEmailOutcome, saveLead } from "@/lib/leads";
import { reportError } from "@/lib/monitoring";

const requestSchema = leadSchema.extend(protectionFields);

const SOURCE_LABELS = { chat: "Chat", newsletter: "Newsletter", hero: "Homepage" } as const;

// Lead capture for the chat concierge, the homepage estimate form and the newsletter form.
export async function POST(request: Request) {
  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ success: false, message: "Please enter a valid email." }, { status: 400 });
  }

  let leadId: string;
  try {
    const blocked = await protectSubmission(request, {
      scope: "lead-form",
      maxPerHour: 5,
      honeypot: body[HONEYPOT_FIELD],
      turnstileToken: body.turnstileToken,
    });
    if (blocked) return blocked;

    leadId = await saveLead({ source: body.source, email: body.email, message: body.message });
  } catch (error) {
    await reportError("Failed to save a lead", error);
    return NextResponse.json(
      { success: false, message: `Sorry, we couldn't save that. Please email us at ${siteConfig.email}.` },
      { status: 500 }
    );
  }

  const label = SOURCE_LABELS[body.source];
  const result = await sendEmail({
    to: ownerEmail(),
    replyTo: body.email,
    subject: `${label} lead: ${body.email}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; color: #111827;">
        <h1 style="font-size: 20px; font-weight: 700; color: #2563eb; margin: 0 0 16px 0;">New ${label.toLowerCase()} lead</h1>
        <table style="width: 100%; font-size: 14px; background: #f9fafb; border-radius: 12px; padding: 16px;">
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0; font-weight: 500;">${escapeHtml(body.email)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Message</td><td style="padding: 6px 0;">${escapeHtml(body.message) || "—"}</td></tr>
        </table>
        <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Reach out within 24 hours to maximize the lead.</p>
      </div>
    `,
  });
  await recordEmailOutcome(leadId, result);

  return NextResponse.json({ success: true });
}
