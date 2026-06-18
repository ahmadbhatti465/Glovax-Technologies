"use client";

import { motion } from "framer-motion";
import { clientLogos } from "@/lib/constants";

export function ClientMarquee() {
  const doubledLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-20 border-y border-white/[0.06] overflow-hidden relative">
      {/* Subtle gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="text-center text-xs tracking-[0.25em] uppercase text-muted-foreground mb-10 font-medium">
          Trusted by innovative companies worldwide
        </p>

        <div className="relative">
          <div className="flex animate-marquee">
            {doubledLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-10 md:px-14 flex items-center justify-center"
              >
                <span className="text-lg md:text-xl font-semibold text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-500 whitespace-nowrap tracking-wide">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
