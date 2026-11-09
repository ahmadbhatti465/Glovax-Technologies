import { z } from "zod";

// Shared by the browser forms and the API routes, so both enforce the same rules.

export const SERVICE_LABELS = {
  web: "Web Development",
  mobile: "Mobile Apps",
  ai: "AI & Machine Learning",
  cloud: "Cloud & DevOps",
  marketing: "Digital Marketing",
  design: "UI/UX Design",
  other: "Other",
} as const;

type ServiceKey = keyof typeof SERVICE_LABELS;
const SERVICE_KEYS = Object.keys(SERVICE_LABELS) as [ServiceKey, ...ServiceKey[]];

// A deliberately dull name: browsers autofill fields called "website" or "url",
// which would silently discard real visitors as bots.
export const HONEYPOT_FIELD = "reference_code";

const SINGLE_LINE = /^[^\r\n]*$/;
const email = z.string().trim().email("Please enter a valid email").max(254, "Email is too long");

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(SINGLE_LINE, "Name must be a single line"),
  email,
  company: z.string().trim().max(120, "Company is too long").regex(SINGLE_LINE).optional(),
  service: z.enum(SERVICE_KEYS, { message: "Please select a service" }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

export type ContactForm = z.infer<typeof contactSchema>;

export const LEAD_SOURCES = ["chat", "newsletter", "hero"] as const;

export const leadSchema = z.object({
  email,
  message: z.string().trim().max(500).optional().default(""),
  source: z.enum(LEAD_SOURCES).optional().default("chat"),
});

/** Spam-protection fields sent alongside every form; never stored. */
export const protectionFields = {
  [HONEYPOT_FIELD]: z.string().max(500).optional(),
  turnstileToken: z.string().max(4096).optional(),
};
