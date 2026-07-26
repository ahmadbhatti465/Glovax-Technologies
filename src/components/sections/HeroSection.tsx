"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";

// Lazy-load FloatingParticles — they're purely decorative and not needed for initial render
const FloatingParticles = dynamic(
  () => import("./HeroParticles").then((mod) => ({ default: mod.FloatingParticles })),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern z-[1]" />

      {/* Ambient orbs — simplified, no heavy blur on initial paint */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div
          className="ambient-orb absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
            willChange: "transform",
          }}
        />
        <div
          className="ambient-orb absolute -bottom-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "-7s",
            willChange: "transform",
          }}
        />
      </div>

      {/* Floating particles — lazy loaded, not critical */}
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-32">
        <div className="max-w-5xl">
          {/* Eyebrow — can animate since it's not the LCP element */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass text-xs md:text-sm font-medium text-muted tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              Software House &amp; Digital Agency
            </span>
          </motion.div>

          {/* Main Heading — VISIBLE IMMEDIATELY (no opacity:0, no delay) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]">
            We build digital
            <br />
            <span className="gold-shimmer">excellence.</span>
          </h1>

          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-24 h-px origin-left"
            style={{
              background: "linear-gradient(90deg, var(--gold-primary), transparent)",
            }}
          />

          {/* Subtitle — LCP ELEMENT — VISIBLE IMMEDIATELY (no animation delay) */}
          <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed">
            Glovax Technologies is a world class software house delivering AI-powered web
            development, mobile apps, cloud solutions, and digital marketing that
            drives real business growth.
          </p>

          {/* CTA Buttons — can animate since they're below LCP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 md:mt-12 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/work" variant="primary" size="lg">
              View Our Work
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline" size="lg">
              Start a Project
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator — deferred animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-muted-foreground"
          >
            <span className="text-xs tracking-[0.25em] uppercase font-medium">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
