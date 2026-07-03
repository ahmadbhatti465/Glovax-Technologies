"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/lib/constants";
import { useSiteContent } from "@/hooks/useSiteContent";

export function CTABanner() {
  const { data: cta } = useSiteContent<{
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    buttons: { label: string; href: string; variant: "primary" | "outline" | "ghost" }[];
  }>("cta_banner", {
    eyebrow: "Let's Collaborate",
    title: "Ready to build",
    titleHighlight: "something great?",
    subtitle: "Let's discuss your project and explore how Glovax Technologies can help you achieve your business goals with cutting-edge technology.",
    buttons: [
      { label: "Start a Project", href: "/contact", variant: "primary" },
      { label: "Book a Call", href: siteConfig.calendarUrl, variant: "outline" },
      { label: "Explore Services", href: "/services", variant: "ghost" },
    ],
  });

  if (!cta) return null;

  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2rem] overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#0E0E0E] to-[#111111] border border-white/[0.06] rounded-[2rem]" />

          {/* Radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
            }}
          />

          {/* Mesh blobs */}
          <div className="absolute inset-0 mesh-blob opacity-40">
            <div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(212,160,23,0.08), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(245,200,66,0.05), transparent 70%)",
                filter: "blur(80px)",
              }}
            />
          </div>

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs md:text-sm font-medium text-muted tracking-wide mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {cta.eyebrow}
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              {cta.title}
              <br />
              <span className="gold-shimmer">{cta.titleHighlight}</span>
            </h2>

            <p className="text-muted text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              {cta.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {cta.buttons?.map((btn) => (
                <MagneticButton key={btn.label} href={btn.href} variant={btn.variant} size="lg">
                  {btn.label}
                </MagneticButton>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
