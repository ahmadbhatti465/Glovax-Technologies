"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { UserCheck, Clock, Brain, ShieldCheck, Lock, LifeBuoy } from "lucide-react";

const differentiators = [
  {
    icon: UserCheck,
    title: "You work with the founder",
    description:
      "Talk directly to the senior engineer building your product — no account-manager middlemen or hand-offs.",
  },
  {
    icon: Clock,
    title: "UK & US timezone overlap",
    description:
      "We keep 6+ hours of overlap with London and Eastern US, so questions get answered the same day.",
  },
  {
    icon: Brain,
    title: "AI + full-stack in one team",
    description:
      "LLM/RAG expertise and React/Node delivery under one roof — no juggling multiple vendors.",
  },
  {
    icon: ShieldCheck,
    title: "Fixed-scope, milestone billing",
    description:
      "Clear proposals and milestone payments, so you always know exactly what's built and what's next.",
  },
  {
    icon: Lock,
    title: "NDA & IP protection",
    description:
      "Happy to sign an NDA on request. Your source code and ideas remain yours, always.",
  },
  {
    icon: LifeBuoy,
    title: "We stay after launch",
    description:
      "Post-launch support and monitoring — we don't disappear once your product is live.",
  },
];

export function WhyGlovax() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-canvas-surface/40 py-24 md:py-32 lg:py-40">
      <div aria-hidden className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader
          eyebrow="Why Glovax"
          title="Built different from a"
          titleHighlight="typical agency"
          subtitle="Working with an overseas team shouldn't feel risky. Here's how we make it feel like an extension of your own team."
        />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((d, index) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
            >
              <SpotlightCard className="group h-full rounded-none border-0 bg-canvas-base p-8 hover:bg-canvas-surface">
                <d.icon
                  className="h-5 w-5 text-brand-textSecondary transition-colors duration-300 group-hover:text-accent-electricBright"
                  aria-hidden
                />
                <h3 className="mt-6 text-base md:text-lg font-semibold tracking-tight text-brand-textPrimary">
                  {d.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-textSecondary">{d.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
