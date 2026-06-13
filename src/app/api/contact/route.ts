import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { siteConfig } from "@/lib/constants";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string(),
  budget: z.string(),
  message: z.string().min(10),
});

const resendApiKey = process.env.RESEND_API_KEY;
const ownerEmail = process.env.OWNER_EMAIL || siteConfig.email;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    const { name, email, company, service, budget, message } = validated;

    const serviceLabel: Record<string, string> = {
      web: "Web Development",
      mobile: "Mobile Apps",
      ai: "AI & Machine Learning",
      cloud: "Cloud & DevOps",
      marketing: "Digital Marketing",
      design: "UI/UX Design",
      other: "Other",
    };

    const budgetLabel: Record<string, string> = {
      "10k-25k": "$10k - $25k",
      "25k-50k": "$25k - $50k",
      "50k-100k": "$50k - $100k",
      "100k+": "$100k+",
      "not-sure": "Not sure yet",
    };

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111827;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #D4A017; margin: 0;">${siteConfig.name}</h1>
          <p style="font-size: 14px; color: #6b7280; margin-top: 4px;">New Contact Form Submission</p>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 16px 0; color: #111827;">Lead Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td>
              <td style="padding: 8px 0; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email</td>
              <td style="padding: 8px 0; font-weight: 500;">
                <a href="mailto:${email}" style="color: #D4A017; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Company</td>
              <td style="padding: 8px 0; font-weight: 500;">${company || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Service</td>
              <td style="padding: 8px 0; font-weight: 500;">${serviceLabel[service] || service}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Budget</td>
              <td style="padding: 8px 0; font-weight: 500;">${budgetLabel[budget] || budget}</td>
            </tr>
          </table>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 24px;">
          <h2 style="font-size: 16px; font-weight: 600; margin: 0 0 12px 0; color: #111827;">Message</h2>
          <p style="font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap; color: #374151;">${message.replace(/\n/g, "<br/>")}</p>
        </div>

        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            Submitted on ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      </div>
    `;

    if (resend) {
      const { data, error } = await resend.emails.send({
        from: `${siteConfig.name} <onboarding@resend.dev>`,
        to: ownerEmail,
        replyTo: email,
        subject: `New Lead: ${name} — ${serviceLabel[service] || service}`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend email error:", error);
        return NextResponse.json(
          {
            success: false,
            message: `Failed to send email: ${error.message}. Make sure OWNER_EMAIL matches your Resend account email.`,
          },
          { status: 500 }
        );
      }

      // Send confirmation to client
      await resend.emails.send({
        from: `${siteConfig.name} <onboarding@resend.dev>`,
        to: email,
        subject: `We received your message — ${siteConfig.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #111827;">
            <h1 style="font-size: 20px; font-weight: 700; color: #D4A017; margin: 0 0 16px 0;">Thanks for reaching out, ${name}!</h1>
            <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">We have received your message about <strong>${serviceLabel[service] || service}</strong> and will get back to you within 24 hours.</p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #6b7280;">— The ${siteConfig.name} Team</p>
          </div>
        `,
      });

      return NextResponse.json(
        { success: true, message: "Message sent! Check your inbox for confirmation." },
        { status: 200 }
      );
    } else {
      console.log("RESEND_API_KEY not configured. Email notification skipped.");
      console.log("Contact form submission:", {
        ...validated,
        submittedAt: new Date().toISOString(),
      });
      return NextResponse.json(
        { success: false, message: "Email service not configured. Add RESEND_API_KEY to .env.local." },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
