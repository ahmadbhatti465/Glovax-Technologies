"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Plus, Search } from "lucide-react";
import { homeFaqs } from "@/data/faqs";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return homeFaqs;
    return homeFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="py-28 md:py-36 lg:py-44 bg-section-alt relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions clients"
          titleHighlight="ask us"
          subtitle="Working with a Lahore-based team for the first time? Here's what most clients want to know."
        />

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10 md:mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenIndex(null);
            }}
            placeholder="Search questions…"
            aria-label="Search frequently asked questions"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-neutral-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal/40 transition-colors"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground text-sm py-10"
            >
              No questions match &quot;{query}&quot;. Try another search — or{" "}
              <a href="/contact" className="text-accent underline underline-offset-4 decoration-teal/30">
                ask us directly
              </a>
              .
            </motion.p>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                    isOpen
                      ? "border-teal/30 bg-surface-raised shadow-glow"
                      : "border-neutral-border bg-surface-raised hover:border-teal/20"
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
                        isOpen ? "gradient-cta text-accent-foreground rotate-45 shadow-glow" : "bg-card text-accent"
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
            })
          )}
        </div>
      </div>
    </section>
  );
}
