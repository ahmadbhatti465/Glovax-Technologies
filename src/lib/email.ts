import { Resend } from "resend";
import { siteConfig } from "@/lib/constants";
import { reportError } from "@/lib/monitoring";

export type EmailResult =
  | { status: "sent" }
  | { status: "skipped" }
  | { status: "failed"; error: string };

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

export const ownerEmail = () => process.env.OWNER_EMAIL || siteConfig.email;

/** Never throws: a failed email must not cost us a lead that is already saved. */
export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "skipped" };

  try {
    const { error } = await new Resend(apiKey).emails.send({
      // Resend's shared sender can only deliver to the Resend account owner.
      from: process.env.RESEND_FROM || `${siteConfig.name} <onboarding@resend.dev>`,
      to,
      subject,
      html,
      replyTo,
    });
    if (!error) return { status: "sent" };

    await reportError(`Resend rejected the email "${subject}"`, new Error(error.message));
    return { status: "failed", error: error.message };
  } catch (error) {
    await reportError(`Failed to send the email "${subject}"`, error);
    return { status: "failed", error: error instanceof Error ? error.message : "Unknown error" };
  }
}
