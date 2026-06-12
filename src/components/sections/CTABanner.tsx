"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";

export function CTABanner() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-surface border border-border rounded-3xl" />
          <div className="absolute inset-0 mesh-blob opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-[80px]" />
          </div>

          <div className="relative z-10 px-8 py-20 md:px-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Ready to build
              <br />
              <span className="gradient-text">something great?</span>
            </h2>

            <p className="text-muted text-base md:text-lg max-w-xl mx-auto mb-8">
              Let's discuss your project and explore how AhmadSols can help you
              achieve your business goals with cutting-edge technology.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="/contact" variant="primary" size="lg">
                Start a Project
              </MagneticButton>
              <MagneticButton href="/services" variant="outline" size="lg">
                Explore Services
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
