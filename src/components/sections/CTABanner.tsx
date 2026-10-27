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
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="border-beam relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-canvas-surface"
        >
          {/* Aurora wash rising from the bottom edge */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 100%, rgba(37, 99, 235, 0.22), transparent 70%), radial-gradient(ellipse 35% 35% at 75% 100%, rgba(168, 85, 247, 0.16), transparent 70%)",
            }}
          />
          <div aria-hidden className="tech-grid absolute inset-0 rotate-180 opacity-70" />

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-mono font-medium uppercase tracking-[0.18em] text-brand-textSecondary">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--status-success)]" />
              {data.eyebrow}
            </div>

            <h2 className="mb-6 text-[2.25rem] md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.04em]">
              <span className="text-premium">{data.title}</span>
              <br />
              <span className="text-signal">{data.titleHighlight}</span>
            </h2>

            <p className="mx-auto mb-10 max-w-xl text-base md:text-lg leading-relaxed text-brand-textSecondary">
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
