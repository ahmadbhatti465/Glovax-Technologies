"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQItem } from "@/types";

export function FaqAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border" aria-label="Frequently Asked Questions">
      <div className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-widest mb-3">
        <HelpCircle className="w-4 h-4" />
        <span>Frequently Asked Questions</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8">
        Everything You Need to Know
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-border bg-surface overflow-hidden transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors hover:bg-surface-raised"
              >
                <span className="font-semibold text-foreground text-base sm:text-lg leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-muted leading-relaxed text-sm sm:text-base border-t border-border/50 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
