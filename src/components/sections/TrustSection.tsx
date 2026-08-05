"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { siteConfig } from "@/lib/constants";
import {
  FileSignature,
  KeyRound,
  Server,
  MessagesSquare,
  ShieldCheck,
  Timer,
} from "lucide-react";

const trustPoints = [
  {
    icon: FileSignature,
    title: "NDA on request",
    description:
      "We sign your NDA or ours before we discuss your idea in detail. Your concept stays confidential, always.",
    highlighted: false,
  },
  {
    icon: KeyRound,
    title: "IP ownership",
    description:
      "Your source code and IP are 100% yours from day one. Nothing is reused, resold, or retained after the project.",
    highlighted: false,
  },
  {
    icon: Server,
    title: "Secure code handling",
    description:
      "Private repos, branch protection, and no shared credentials. Your codebase stays locked down and auditable.",
    highlighted: false,
  },
  {
    icon: MessagesSquare,
    title: "Communication you control",
    description:
      "Slack or WhatsApp for updates, Zoom for calls, and a live board you can check anytime. Weekly demos included.",
    highlighted: false,
  },
  {
    icon: ShieldCheck,
    title: "Protected payments",
    description:
      "Fixed milestones with 30–50% to start. Prefer extra security? We also work through Upwork escrow.",
    highlighted: false,
  },
  {
    icon: Timer,
    title: "Fast, honest replies",
    description: `We reply within ${siteConfig.responseTime} on business days and you'll always know exactly where the project stands.`,
    highlighted: true,
  },
];

export function TrustSection() {
  return (
    <section className="py-28 md:py-36 lg:py-44 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          eyebrow="Trust & Security"
          title="Build with"
          titleHighlight="confidence, from day one"
          subtitle="Working with an overseas team shouldn't mean worrying about your code, your ideas, or your money. Here's how we protect all three."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative p-8 rounded-3xl border transition-all duration-500 overflow-hidden card-shine ${
                point.highlighted
                  ? "bg-surface-raised border-teal/40 shadow-glow-strong gradient-border"
                  : "bg-surface-raised border-neutral-border hover:border-teal/30 hover:shadow-card"
              }`}
            >
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal/10 border border-teal/20 text-accent shadow-glow group-hover:shadow-glow-strong group-hover:scale-105 transition-all duration-500">
                  <point.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">{point.title}</h3>
                <p className="text-muted text-sm md:text-base leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
