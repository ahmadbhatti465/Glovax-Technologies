"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";
import { Mail, Phone, MapPin, Calendar, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Contact"
            title="Let's work"
            titleHighlight="together"
            subtitle="You can reach Glovax Technologies by email, phone, or the form below. We reply within 24 hours on business days and are happy to answer questions about quotes, timelines, and services."
            align="left"
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Enter Your Name"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter Your Email"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    {...register("company")}
                    type="text"
                    placeholder="Enter Your Company Name"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service Interest *
                  </label>
                  <select
                    {...register("service")}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
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
                  {errors.service && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </MagneticButton>
                </div>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Book a Call */}
                <div className="relative rounded-2xl overflow-hidden border border-teal/20 p-6 bg-surface-raised">
                  <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                      background:
                        "radial-gradient(circle at top right, var(--teal-glow), transparent 60%)",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider mb-3">
                      <Calendar className="w-4 h-4" />
                      Prefer to talk?
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1.5">
                      Book a Call
                    </h2>
                    <p className="text-sm text-muted mb-5 leading-relaxed">
                      Skip the back-and-forth. Grab a 30-minute slot on our
                      calendar and let&apos;s discuss your project live.
                    </p>
                    <a
                      href="#book"
                      className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-full gradient-cta text-accent-foreground font-semibold text-sm shadow-glow hover:shadow-glow-strong hover:brightness-110 transition-all"
                    >
                      Schedule Now
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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

          {/* Calendly inline booking embed */}
          <div id="book" className="mt-16 md:mt-24">
            <div className="max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Prefer to book a slot <span className="teal-shimmer">right away?</span>
              </h2>
              <p className="text-muted text-base mb-8">
                Skip the form — grab a 30-minute slot on our calendar directly. We reply within{" "}
                {siteConfig.responseTime} on every inquiry.
              </p>
              <div className="rounded-2xl border border-neutral-border bg-surface-raised overflow-hidden">
                <iframe
                  src={`https://calendly.com/${siteConfig.calendarUrl.replace("https://calendly.com/", "")}?theme=dark&hide_gdpr_banner=1&primary_color=D4AF37`}
                  title="Schedule a call with Glovax Technologies"
                  loading="lazy"
                  className="w-full h-[680px] lg:h-[750px] block"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
