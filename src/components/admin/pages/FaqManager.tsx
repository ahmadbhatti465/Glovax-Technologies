"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, HelpCircle, HelpCircle as FaqIcon } from "lucide-react";
import { FAQItem } from "@/types";

interface FaqManagerProps {
  faqs: FAQItem[];
  onChange: (faqs: FAQItem[]) => void;
}

export function FaqManager({ faqs, onChange }: FaqManagerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleAddFaq = () => {
    const updated = [
      ...faqs,
      {
        question: "",
        answer: "",
      },
    ];
    onChange(updated);
    setOpenIndex(updated.length - 1);
  };

  const handleUpdateFaq = (index: number, key: "question" | "answer", val: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [key]: val };
    onChange(updated);
  };

  const handleRemoveFaq = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    onChange(updated);
    if (openIndex === index) setOpenIndex(null);
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === faqs.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
    setOpenIndex(targetIndex);
  };

  return (
    <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaqIcon className="w-4 h-4 text-[#1EDAC6]" />
          <div>
            <h3 className="font-semibold text-white text-sm">FAQ Section & Structured Data</h3>
            <p className="text-[11px] text-gray-400">
              Generates interactive page accordions and FAQPage schema JSON-LD
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddFaq}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1EDAC6]/10 hover:bg-[#1EDAC6]/20 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Question
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-xl p-6 text-center text-gray-500 text-xs">
          <HelpCircle className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          No FAQs added yet. Adding 3–5 helpful questions improves keyword coverage and rich search results.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card border border-[#1EDAC6]/10 rounded-xl overflow-hidden transition-all"
              >
                {/* FAQ Summary Row */}
                <div className="flex items-center justify-between p-3 bg-surface border-b border-white/5 gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1EDAC6]/10 text-[#1EDAC6] text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(index, "question", e.target.value)}
                    placeholder="e.g. How does Glovax Technologies handle custom software development?"
                    className="flex-1 bg-transparent text-xs text-white font-medium focus:outline-none placeholder:text-gray-600"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveFaq(index, "up")}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveFaq(index, "down")}
                      disabled={index === faqs.length - 1}
                      className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* FAQ Answer Area */}
                <div className="p-3">
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(index, "answer", e.target.value)}
                    placeholder="Provide a clear, detailed and helpful answer..."
                    rows={3}
                    className="w-full bg-background border border-[#1EDAC6]/20 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#1EDAC6] resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
