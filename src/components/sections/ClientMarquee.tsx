"use client";

import { motion } from "framer-motion";
import { clientLogos } from "@/lib/constants";

export function ClientMarquee() {
  const doubledLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-20 border-y border-border overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <p className="text-center text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10">
          Trusted by innovative companies worldwide
        </p>

        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

          <div className="flex animate-marquee">
            {doubledLogos.map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
              >
                <span className="text-lg md:text-xl font-semibold text-muted-foreground/40 hover:text-muted-foreground transition-colors whitespace-nowrap">
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
