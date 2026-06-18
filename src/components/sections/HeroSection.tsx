"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 10,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-accent/30"
          style={{ left: `${p.x}%`, bottom: "-5%" }}
          animate={{
            y: [0, -window.innerHeight * 1.1],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern z-[1]" />

      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div
          className="ambient-orb absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="ambient-orb absolute -bottom-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "-7s",
          }}
        />
        <div
          className="ambient-orb absolute top-1/4 left-1/2 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            filter: "blur(90px)",
            animationDelay: "-12s",
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-32">
        <div className="max-w-5xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05]"
          >
            We build digital
            <br />
            <span className="gold-shimmer">excellence.</span>
          </motion.h1>

          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-24 h-px origin-left"
            style={{
              background: "linear-gradient(90deg, var(--gold-primary), transparent)",
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed"
          >
            Glovax Technologies is a world class software house delivering AI-powered web
            development, mobile apps, cloud solutions, and digital marketing that
            drives real business growth.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
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
