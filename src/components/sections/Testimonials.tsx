"use client";

import { motion } from "framer-motion";
import { testimonials as fallbackTestimonials } from "@/data/testimonials";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Star, Quote, Linkedin, Play } from "lucide-react";
import Image from "next/image";
import { Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

/** Country code → flag emoji. Falls back to a dot when unknown. */
function flagFor(code?: string): string {
  if (!code || code.length !== 2) return "●";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function Avatar({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.avatar) {
    return (
      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-teal/25 shadow-glow flex-shrink-0">
        <Image src={testimonial.avatar} alt={testimonial.author} fill sizes="48px" className="object-cover" />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal/25 to-teal-deep/25 flex items-center justify-center border border-teal/25 shadow-glow flex-shrink-0">
      <span className="text-base font-bold text-accent">
        {testimonial.author.charAt(0)}
      </span>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const placeholder = testimonial.content.startsWith("[REPLACE");

  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative p-8 md:p-10 rounded-3xl bg-surface-raised border border-neutral-border hover:border-teal/30 hover:shadow-card transition-all duration-500 card-shine"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(400px circle at 20% 20%, var(--teal-glow), transparent 60%)",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <Quote className="w-10 h-10 text-accent/15 flex-shrink-0" />
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-0.5">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-accent text-accent drop-shadow-[0_0_4px_var(--teal-glow)]"
                />
              ))}
            </div>
            {testimonial.projectType && (
              <span className="px-2.5 py-1 text-[10px] font-medium bg-card border border-neutral-border rounded-full text-muted-foreground">
                {testimonial.projectType}
              </span>
            )}
          </div>
        </div>

        {placeholder ? (
          <p className="text-muted italic text-base md:text-lg leading-relaxed mb-8">
            "Real client quote coming soon — add via the admin panel."
          </p>
        ) : (
          <p className="text-foreground/90 text-base md:text-lg leading-relaxed mb-8 line-clamp-5">
            "{testimonial.content}"
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar testimonial={testimonial} />
            <div>
              <p className="text-sm font-semibold">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {testimonial.role}, {testimonial.company}
              </p>
              {testimonial.country && (
                <p className="text-[11px] text-muted-foreground/80 mt-1 inline-flex items-center gap-1.5">
                  <span aria-hidden>{flagFor(testimonial.countryCode)}</span>
                  {testimonial.country}
                </p>
              )}
            </div>
          </div>

          {testimonial.linkedin && (
            <a
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${testimonial.author} on LinkedIn`}
              className="w-9 h-9 rounded-full border border-neutral-border bg-card flex items-center justify-center text-muted-foreground hover:text-accent hover:border-teal/30 hover:shadow-glow transition-all duration-300"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials({ testimonials: serverTestimonials }: TestimonialsProps) {
  const testimonials = serverTestimonials?.length ? serverTestimonials : fallbackTestimonials;

  return (
    <section className="py-28 md:py-36 lg:py-44 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
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
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Video testimonial placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <div className="group relative aspect-[16/5] md:aspect-[21/7] rounded-3xl overflow-hidden border border-neutral-border">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--teal) 18%, var(--brand-bg)) 0%, var(--brand-bg-raise) 50%, color-mix(in srgb, var(--azure) 12%, var(--brand-bg)) 100%)",
              }}
            />
            <div className="absolute inset-0 grid-pattern opacity-40" />

            {/* play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-teal/30 blur-xl group-hover:bg-teal/40 transition-colors duration-500" />
                <button
                  type="button"
                  aria-label="Play client story video (coming soon)"
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full gradient-cta text-accent-foreground flex items-center justify-center shadow-glow-strong transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="w-6 h-6 md:w-7 md:h-7 fill-current translate-x-0.5" />
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold tracking-tight">Hear it from our clients</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1.5">
                  Video stories coming soon — watch founders talk about shipping with Glovax.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
