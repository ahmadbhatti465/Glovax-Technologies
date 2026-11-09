import { SectionHeader } from "@/components/shared/SectionHeader";
import { Plus } from "lucide-react";
import { homeFaqs } from "@/data/faqs";

export function FAQ() {
  return (
    <section className="py-20 md:py-28 bg-section-alt relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions clients"
          titleHighlight="ask us"
          subtitle="Working with a Lahore-based team for the first time? Here's what most clients want to know."
        />


        <div className="space-y-4">
          {homeFaqs.map((faq, index) => (
            <details
              name="faq"
              open={index === 0}
              data-reveal
              style={{ ["--stagger" as string]: index * 0.06 }}
              key={faq.question}
              className="group rounded-2xl border border-neutral-border bg-surface-raised overflow-hidden transition-colors duration-300 hover:border-white/[0.14] open:border-accent-electricBright/30 open:shadow-glow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 md:px-8 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-base md:text-lg font-semibold tracking-tight">{faq.question}</span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-card text-accent transition-transform duration-300 group-open:rotate-45 group-open:bg-accent-electric group-open:text-white">
                  <Plus className="w-4 h-4" />
                </span>
              </summary>
              <p className="px-6 md:px-8 pb-6 text-muted leading-relaxed text-sm md:text-base">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
