"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
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
    <section className="py-24 md:py-32 lg:py-40 bg-section-alt relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          eyebrow="Why Glovax"
          title="Built different from a"
          titleHighlight="typical agency"
          subtitle="Working with an overseas team shouldn't feel risky. Here's how we make it feel like an extension of your own team."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {differentiators.map((d, index) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative p-8 rounded-3xl bg-surface-raised border border-neutral-border hover:border-teal/30 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-card border border-teal/20 text-accent shadow-[0_0_20px_var(--teal-glow)] group-hover:shadow-[0_0_30px_var(--teal-glow)] transition-shadow duration-500">
                  <d.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{d.title}</h3>
                <p className="text-muted text-sm md:text-base leading-relaxed">{d.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
