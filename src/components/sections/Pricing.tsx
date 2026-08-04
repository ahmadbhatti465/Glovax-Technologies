"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/lib/constants";
import { Check, Sparkles } from "lucide-react";

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

export function Pricing() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
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
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative flex flex-col p-8 md:p-10 rounded-3xl transition-all duration-500 ${
                tier.highlighted
                  ? "bg-surface-raised border border-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.08)] lg:-translate-y-3"
                  : "bg-surface-raised border border-white/[0.06] hover:border-gold/25"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold text-[#0A0A0A] text-xs font-semibold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold tracking-tight mb-1.5">{tier.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{tier.tagline}</p>

              <div className="mb-8">
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-accent">{tier.price}</div>
                <div className="mt-1 text-xs text-muted-foreground">{tier.priceNote}</div>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <MagneticButton
                href={siteConfig.calendarUrl}
                variant={tier.highlighted ? "primary" : "outline"}
                size="md"
                className="w-full"
              >
                Book a Free Call
              </MagneticButton>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Not sure which fits?{" "}
          <a
            href={siteConfig.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-gold-bright transition-colors"
          >
            Book a 30-minute call
          </a>{" "}
          — it&apos;s free and there&apos;s no obligation.
        </p>
      </div>
    </section>
  );
}
