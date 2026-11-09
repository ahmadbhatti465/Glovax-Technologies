import { NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/constants";
import { escapeHtml, ownerEmail, sendEmail } from "@/lib/email";
import { protectSubmission } from "@/lib/form-protection";
import { contactSchema, HONEYPOT_FIELD, protectionFields, SERVICE_LABELS } from "@/lib/lead-schemas";
import { recordEmailOutcome, saveLead } from "@/lib/leads";
import { reportError } from "@/lib/monitoring";

const requestSchema = contactSchema.extend(protectionFields);

export async function POST(request: Request) {
  let body: z.infer<typeof requestSchema>;
  try {
    body = requestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the form and try again.",
        errors: error instanceof z.ZodError ? error.issues : undefined,
      },
      { status: 400 }
    );
  }

  const { name, email, company, service, message } = body;

  let leadId: string;
  try {
    const blocked = await protectSubmission(request, {
      scope: "contact-form",
      maxPerHour: 5,
      honeypot: body[HONEYPOT_FIELD],
      turnstileToken: body.turnstileToken,
    });
    if (blocked) return blocked;

    leadId = await saveLead({ source: "contact", name, email, company, service, message });
  } catch (error) {
    await reportError("Failed to save a contact submission", error);
    return NextResponse.json(
      { success: false, message: `Sorry, we couldn't save your message. Please email us at ${siteConfig.email}.` },
      { status: 500 }
    );
  }

  const serviceLabel = SERVICE_LABELS[service];
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  const [ownerResult, confirmationResult] = await Promise.all([
    sendEmail({
      to: ownerEmail(),
      replyTo: email,
      subject: `New Lead: ${name} — ${serviceLabel}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111827;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #1EDAC6; margin: 0;">${siteConfig.name}</h1>
            <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">New Contact Form Submission</p>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #111827;">Lead Details</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td>
                <td style="padding: 8px 0; font-weight: 500;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Email</td>
                <td style="padding: 8px 0; font-weight: 500;">
                  <a href="mailto:${safeEmail}" style="color: #1EDAC6; text-decoration: none;">${safeEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Company</td>
                <td style="padding: 8px 0; font-weight: 500;">${company ? escapeHtml(company) : "—"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Service</td>
                <td style="padding: 8px 0; font-weight: 500;">${escapeHtml(serviceLabel)}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
            <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #111827;">Message</h2>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; color: #374151;">${escapeHtml(message)}</p>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Submitted on ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
        </div>
      `,
    }),
    sendEmail({
      to: email,
      subject: `We received your message — ${siteConfig.name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111827;">
          <h1 style="font-size: 20px; font-weight: 700; color: #1EDAC6; margin: 0 0 16px 0;">Thanks for reaching out, ${safeName}!</h1>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">We have received your message about <strong>${escapeHtml(serviceLabel)}</strong> and will get back to you within ${siteConfig.responseTime}.</p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #6b7280;">— The ${siteConfig.name} Team</p>
        </div>
      `,
    }),
  ]);

  await recordEmailOutcome(leadId, ownerResult);

  return NextResponse.json({
    success: true,
    message:
      confirmationResult.status === "sent"
        ? "Message sent! Check your inbox for confirmation."
        : `Message received! We'll get back to you within ${siteConfig.responseTime}.`,
  });
}
