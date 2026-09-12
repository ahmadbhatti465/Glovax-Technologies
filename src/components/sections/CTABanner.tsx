"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/lib/constants";
import { ShieldCheck, KeyRound, Timer, Check, Mail } from "lucide-react";

interface CTABannerProps {
  cta?: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    buttons: { label: string; href: string; variant: "primary" | "outline" | "ghost" }[];
  };
  lastUpdated?: Date | null;
}

const fallbackCTA = {
  eyebrow: "Let's Collaborate",
  title: "Have an idea? Let's",
  titleHighlight: "build it together.",
  subtitle: "Book a free 30-minute call — we'll scope your project, answer questions, and give you a clear next step. No obligation.",
  buttons: [
    { label: "Book a Free Call", href: "/contact", variant: "primary" as const },
    { label: "See Our Work", href: "/work", variant: "outline" as const },
    { label: "Explore Services", href: "/services", variant: "ghost" as const },
  ],
};

const trustBadges = [
  { icon: ShieldCheck, label: "NDA on request" },
  { icon: KeyRound, label: "IP ownership" },
  { icon: Timer, label: `${siteConfig.responseTime} response` },
  { icon: Check, label: "Milestone billing" },
];

export function CTABanner({ cta, lastUpdated }: CTABannerProps) {
  const data = cta || fallbackCTA;

  return (
    <section className="py-28 md:py-36 lg:py-44 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-raised via-background to-surface-raised border border-neutral-border rounded-[2rem]" />

          {/* Brand gradient (deep green → teal) */}
          <div className="absolute inset-0 gradient-brand opacity-30 rounded-[2rem]" />

          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />

          {/* Mesh blobs */}
          <div className="absolute inset-0 mesh-blob opacity-40">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, var(--teal-glow), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full"
              style={{
                background: "radial-gradient(circle, var(--teal-muted), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>

          {/* Subtle grid texture */}
          <div className="absolute inset-0 grid-pattern opacity-50" />

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-medium text-muted tracking-wide mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {data.eyebrow}
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              {data.title}
              <br />
              <span className="teal-shimmer">{data.titleHighlight}</span>
            </h2>

            <p className="text-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {data.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {data.buttons?.map((btn, i) => (
                <MagneticButton
                  key={btn.label}
                  href={btn.href}
                  variant={btn.variant}
                  size="lg"
                  withArrow={i === 0}
                >
                  {btn.label}
                </MagneticButton>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <badge.icon className="w-4 h-4 text-accent" />
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>
                  Prefer email? Reach us at{" "}
                  <strong className="text-foreground hover:text-accent font-medium underline underline-offset-4 decoration-accent/40">
                    {siteConfig.email}
                  </strong>
                </span>
              </a>
            </div>

            {lastUpdated && (
              <p className="mt-6 text-xs text-muted-foreground">
                Last updated {new Date(lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
