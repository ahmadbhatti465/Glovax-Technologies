"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/lib/constants";
import { Check, Sparkles, ShieldCheck, CalendarCheck, FileSignature, BadgeCheck } from "lucide-react";

const tiers = [
  {
    name: "MVP Sprint",
    tagline: "Validate your idea in weeks",
    price: "Fixed quote",
    priceNote: "Scoped on a free call",
    features: [
      "2–4 week delivery",
      "Design + build + deploy",
      "Weekly demo calls",
      "Your code, your IP",
      "30-day support included",
    ],
    highlighted: false,
  },
  {
    name: "Product Build",
    tagline: "Full SaaS or web product",
    price: "Custom proposal",
    priceNote: "Milestone billing",
    features: [
      "Multi-phase delivery",
      "AI features & integrations",
      "Dedicated build team",
      "Fixed-scope milestones",
      "90-day support included",
    ],
    highlighted: true,
  },
  {
    name: "AI & Team Aug",
    tagline: "Ongoing AI / dedicated dev",
    price: "Monthly retainer",
    priceNote: "Scale up or down",
    features: [
      "AI/LLM/RAG specialists",
      "Slack access to your team",
      "Weekly sprint reviews",
      "Pause or cancel anytime",
      "Priority support",
    ],
    highlighted: false,
  },
];

const guarantees = [
  {
    icon: CalendarCheck,
    title: "Free scoping call",
    description: "30 minutes, no obligation — leave with a clear plan and quote.",
  },
  {
    icon: ShieldCheck,
    title: "Milestone billing",
    description: "Pay as features land. 30–50% to start, then per milestone.",
  },
  {
    icon: FileSignature,
    title: "NDA & IP protection",
    description: "Signed NDA on request. Your code and ideas stay yours, always.",
  },
  {
    icon: BadgeCheck,
    title: "Money-back guarantee",
    description: "If we miss an agreed milestone, that milestone is free. No risk.",
  },
];

const sharedFeatures = [
  "Senior engineers only",
  "Weekly demo calls",
  "Your IP, always",
  "Transparent progress board",
  "Support after launch",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 lg:py-44 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Engagements"
          title="Pricing that"
          titleHighlight="fits how you work"
          subtitle="No hidden costs, no guesswork. Pick an engagement model — we'll scope it precisely on a free call."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col p-8 md:p-10 rounded-3xl transition-all duration-500 overflow-hidden ${
                tier.highlighted
                  ? "bg-surface-raised border border-teal/40 shadow-glow-strong lg:-translate-y-3 gradient-border card-shine"
                  : "bg-surface-raised border border-neutral-border hover:border-teal/25 hover:shadow-card"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-teal/60 to-transparent" />
              )}

              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full gradient-cta text-accent-foreground text-xs font-semibold tracking-wide shadow-glow">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold tracking-tight mb-1.5">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{tier.tagline}</p>

              <div className="mb-8">
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-accent">{tier.price}</div>
                <div className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</div>
                {tier.highlighted && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-success">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Money-back if we miss a milestone
                  </div>
                )}
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-teal/10 border border-teal/25 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-accent" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <MagneticButton
                href={siteConfig.calendarUrl}
                variant={tier.highlighted ? "primary" : "outline"}
                size="md"
                withArrow
                className="w-full"
              >
                Book a Free Call
              </MagneticButton>
            </motion.div>
          ))}
        </div>

        {/* Guarantee strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {guarantees.map((g) => (
            <div
              key={g.title}
              className="flex items-start gap-4 rounded-2xl border border-neutral-border bg-surface-raised/60 p-5"
            >
              <div className="w-11 h-11 rounded-xl bg-teal/10 border border-teal/20 text-accent flex items-center justify-center flex-shrink-0 shadow-glow">
                <g.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight">{g.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{g.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Feature comparison — what every engagement includes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 md:mt-16"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Every engagement includes
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {sharedFeatures.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-raised border border-neutral-border text-xs text-muted-foreground"
              >
                <Check className="w-3 h-3 text-accent" />
                {feature}
              </span>
            ))}
          </div>
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Not sure which fits?{" "}
          <a
            href={siteConfig.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-teal-bright transition-colors underline underline-offset-4 decoration-teal/30"
          >
            Book a 30-minute call
          </a>{" "}
          — it&apos;s free and there&apos;s no obligation.
        </p>
      </div>
    </section>
  );
}
