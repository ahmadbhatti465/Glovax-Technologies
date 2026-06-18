"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/constants";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function StatsCounter() {
  return (
    <section className="py-20 md:py-28 border-y border-white/[0.06] bg-[#0D0D0D] relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,200,66,0.04) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center relative"
            >
              {/* Subtle divider for desktop */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16"
                  style={{
                    background: "linear-gradient(180deg, transparent, rgba(212,160,23,0.15), transparent)",
                  }}
                />
              )}

              <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="gold-shimmer"
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-4 h-px bg-accent/30" />
                <p className="text-sm md:text-base text-muted-foreground tracking-wide">{stat.label}</p>
                <div className="w-4 h-px bg-accent/30" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
