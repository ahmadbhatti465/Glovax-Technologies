"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Plus } from "lucide-react";
import { homeFaqs } from "@/data/faqs";

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
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
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
                  <span className="text-base md:text-lg font-semibold tracking-tight">{faq.question}</span>
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
                        {faq.answer}
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
