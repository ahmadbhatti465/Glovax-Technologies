"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/lib/constants";

// Lazy-load the particle network — decorative and not needed for initial render
const ParticleNetwork = dynamic(
  () => import("./ParticleNetwork").then((mod) => ({ default: mod.ParticleNetwork })),
  { ssr: false }
);

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: "Hero early-access / free-estimate request",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Thanks! We'll be in touch within 24 hours.");
        setEmail("");
        setStatus("done");
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern z-[1]" />

      {/* Brand gradient layer (deep green → teal) */}
      <div className="absolute inset-0 gradient-brand opacity-30 z-0" />

      {/* Ambient orbs — simplified, no heavy blur on initial paint */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div
          className="ambient-orb absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--teal) 15%, transparent) 0%, transparent 70%)",
            filter: "blur(80px)",
            willChange: "transform",
          }}
        />
        <div
          className="ambient-orb absolute -bottom-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--teal-bright) 12%, transparent) 0%, transparent 70%)",
            filter: "blur(100px)",
            animationDelay: "-7s",
            willChange: "transform",
          }}
        />
      </div>

      {/* Depth vignette — darkens toward the bottom so the hero melts into the page */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-background"
      />

      {/* Top light accent line (techietribe early-access shimmer line) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {/* Particle constellation network — lazy loaded, not critical */}
      <ParticleNetwork />

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold tracking-tight leading-[1.08]">
            We turn your idea into an
            <br />
            <span className="teal-shimmer">AI-powered product</span> that scales.
          </h1>

          {/* Teal accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 w-24 h-px origin-left"
            style={{
              background: "linear-gradient(90deg, var(--teal), transparent)",
            }}
          />

          {/* Subtitle — LCP ELEMENT — VISIBLE IMMEDIATELY (no animation delay) */}
          <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted max-w-2xl leading-relaxed">
            A Lahore-based software house and AI/ML agency trusted by UK &amp; US
            businesses. We turn bold ideas into AI-powered web, mobile, and SaaS
            products that drive real revenue.
          </p>

          {/* CTA Buttons — can animate since they're below LCP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 md:mt-12 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href={siteConfig.calendarUrl} variant="primary" size="lg">
              Book a Free Call
            </MagneticButton>
            <MagneticButton href="/work" variant="outline" size="lg">
              See Our Work
            </MagneticButton>
          </motion.div>

          {/* Link-style email capture — underline input, no box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 md:mt-14 max-w-xl"
          >
            <label
              htmlFor="hero-email"
              className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-2"
            >
              Email address
            </label>
            <form
              onSubmit={handleSubmit}
              className="group flex items-center gap-4 border-b-2 border-neutral-border pb-2 transition-colors duration-300 focus-within:border-teal hover:border-muted-foreground/60"
            >
              <input
                id="hero-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={status === "sending"}
                className="flex-1 min-w-0 bg-transparent text-base md:text-lg text-foreground placeholder:text-muted-foreground/70 outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-1.5 text-base md:text-lg font-semibold text-accent hover:text-accent-hover transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="mt-2.5 text-xs text-muted-foreground">
              Free, no obligation — we reply within {siteConfig.responseTime}.
            </p>
          </motion.div>

          {/* Trust microcopy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" /> UK/US timezone overlap
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" /> NDA on request
            </span>
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" /> 24-hour response
            </span>
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
