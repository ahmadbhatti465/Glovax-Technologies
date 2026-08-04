"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Do you work with clients in the UK and US?",
    a: "Yes — most of our clients are in the UK and US. We keep 6+ hours of overlap with London and Eastern US working hours, so meetings and reviews happen at times that suit you, not just us.",
  },
  {
    q: "How do we communicate during the project?",
    a: "We use Slack or WhatsApp for day-to-day updates, Zoom for calls and demos, and share progress through a live board you can check any time. You'll get a weekly demo every step of the way — no black boxes.",
  },
  {
    q: "How do payments work, and is it secure?",
    a: "We work on fixed milestones with clear deliverables — typically 30–50% upfront and the rest at agreed milestones. We invoice properly, and if you hire through Upwork, payments go through Upwork's escrow for extra protection.",
  },
  {
    q: "Will you sign an NDA?",
    a: "Absolutely. We'll sign your NDA (or provide ours) before we discuss your idea in detail. Your source code and IP always remain yours — we only ever build what you approve.",
  },
  {
    q: "What happens after launch?",
    a: "Every project includes a support window after launch, and we offer extended support plans. We monitor, fix issues, and help you iterate — we don't disappear once the site is live.",
  },
  {
    q: "How long does a typical project take?",
    a: "An MVP can ship in 2–4 weeks. A full SaaS or web product typically takes 8–16 weeks depending on scope and integrations. We'll give you a precise timeline in the proposal after a free scoping call.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-section-alt relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions UK & US clients"
          titleHighlight="ask us"
          subtitle="Working with a Lahore-based team for the first time? Here's what most clients want to know."
        />

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={`rounded-2xl border transition-colors duration-300 ${
                  isOpen ? "border-gold/30 bg-surface-raised" : "border-white/[0.06] bg-surface-raised hover:border-gold/20"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-semibold tracking-tight">{faq.q}</span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? "bg-gold text-[#0A0A0A] rotate-45" : "bg-card text-accent"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-6 text-muted leading-relaxed text-sm md:text-base">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
