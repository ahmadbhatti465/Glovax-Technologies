"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Background mesh blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="mesh-blob absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[120px]" />
        <div
          className="mesh-blob absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-accent/3 blur-[100px]"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="mesh-blob absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[80px]"
          style={{ animationDelay: "-10s" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-32">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-raised border border-border text-xs md:text-sm font-medium text-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Software House & Digital Agency
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            We build digital
            <br />
            <span className="gradient-text">excellence.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed"
          >
            AhmadSols is a world-class software house delivering AI-powered web
            development, mobile apps, cloud solutions, and digital marketing that
            drives real business growth.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 md:mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/work" variant="primary" size="lg">
              View Our Work
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline" size="lg">
              Start a Project
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
