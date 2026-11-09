"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useForm, type Resolver } from "react-hook-form";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { Mail, Phone, MapPin, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageBackdrop } from "@/components/shared/PageBackdrop";
import { HoneypotField, useSpamProtection } from "@/components/shared/SpamProtection";
import type { ContactForm } from "@/lib/lead-schemas";

const fieldClass =
  "w-full rounded-xl border border-white/[0.08] bg-canvas-base px-4 py-3 text-sm text-brand-textPrimary " +
  "placeholder:text-brand-textMuted outline-none transition-[border-color,box-shadow] duration-200 " +
  "hover:border-white/[0.14] focus:border-accent-electricBright/60 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.15)] " +
  "aria-[invalid=true]:border-destructive/60";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-brand-textPrimary">
        {label}
        {required && <span className="ml-0.5 text-brand-textMuted" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// The validation library is large, so it loads only when the form is submitted.
const lazyResolver: Resolver<ContactForm> = async (values, context, options) => {
  const [{ zodResolver }, { contactSchema }] = await Promise.all([
    import("@hookform/resolvers/zod"),
    import("@/lib/lead-schemas"),
  ]);
  return zodResolver(contactSchema)(values, context, options);
};

export default function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formRef, turnstileSlot, getProtectionFields } = useSpamProtection();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: lazyResolver,
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...(await getProtectionFields()) }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || `Message sent! We'll get back to you within ${siteConfig.responseTime}.`);
        reset();
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to send message. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative isolate outline-none pt-28 pb-24">
        <PageBackdrop />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Contact"
            title="Let's work"
            titleHighlight="together"
            subtitle={`You can reach Glovax Technologies directly at ${siteConfig.email}, by phone, or through the form below. We reply within 24 hours on business days and are happy to answer questions about quotes, timelines, and services.`}
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <form
                ref={formRef}
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="relative space-y-5 rounded-2xl border border-white/[0.06] bg-canvas-surface p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] md:p-8"
              >
                <HoneypotField />
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field id="contact-name" label="Name" required error={errors.name?.message}>
                    <input
                      {...register("name")}
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Cooper"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      className={fieldClass}
                    />
                  </Field>
                  <Field id="contact-email" label="Work email" required error={errors.email?.message}>
                    <input
                      {...register("email")}
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      className={fieldClass}
                    />
                  </Field>
                </div>

                <Field id="contact-company" label="Company">
                  <input
                    {...register("company")}
                    id="contact-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    className={fieldClass}
                  />
                </Field>

                <Field id="contact-service" label="Service interest" required error={errors.service?.message}>
                  <div className="relative">
                    <select
                      {...register("service")}
                      id="contact-service"
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? "contact-service-error" : undefined}
                      className={`${fieldClass} cursor-pointer appearance-none pr-10 [&>option]:bg-canvas-surface`}
                    >
                      <option value="">Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="mobile">Mobile Apps</option>
                      <option value="ai">AI & Machine Learning</option>
                      <option value="cloud">Cloud & DevOps</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="design">UI/UX Design</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textMuted"
                      aria-hidden
                    />
                  </div>
                </Field>

                <Field id="contact-message" label="Message" required error={errors.message?.message}>
                  <textarea
                    {...register("message")}
                    id="contact-message"
                    rows={5}
                    placeholder="Tell us about your project, goals, and timeline…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${fieldClass} resize-none`}
                  />
                </Field>

                {turnstileSlot}

                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-brand-textMuted">
                    We reply within {siteConfig.responseTime}. NDA available on request.
                  </p>
                  <MagneticButton type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                    {isSubmitting ? "Sending…" : "Send message"}
                  </MagneticButton>
                </div>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-4">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{siteConfig.email}</span>
                    </a>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{siteConfig.phone}</span>
                    </a>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{siteConfig.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Response Time
                  </h3>
                  <p className="text-sm text-muted">
                    We typically respond to all inquiries within {siteConfig.responseTime} during
                    business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
