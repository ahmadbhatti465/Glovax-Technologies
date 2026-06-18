"use client";

import { motion } from "framer-motion";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Testimonial } from "@/types";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTestimonials(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          eyebrow="Testimonials"
          title="What our clients"
          titleHighlight="say"
          subtitle="Don't just take our word for it. Here's what industry leaders say about working with Glovax Technologies."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative p-8 md:p-10 rounded-3xl bg-[#111111] border border-white/[0.06] hover:border-[#D4A017]/15 transition-all duration-500 group"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: "radial-gradient(400px circle at 20% 20%, rgba(212,160,23,0.05), transparent 60%)",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <Quote className="w-10 h-10 text-accent/15" />
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent drop-shadow-[0_0_4px_rgba(212,160,23,0.4)]"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-foreground/90 text-sm md:text-base leading-relaxed mb-8">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A017]/20 to-[#B8820A]/20 flex items-center justify-center border border-[#D4A017]/20 shadow-[0_0_15px_rgba(212,160,23,0.08)]">
                    <span className="text-base font-semibold text-accent">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
