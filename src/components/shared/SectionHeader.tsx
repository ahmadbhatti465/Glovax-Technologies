"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignClasses[align]} max-w-4xl mx-auto mb-16 md:mb-20 ${className}`}
    >
      {eyebrow && (
        <span className="text-accent text-xs md:text-sm font-medium tracking-[0.25em] uppercase mb-5 inline-flex items-center gap-3">
          <span className="w-8 h-px bg-accent/30 hidden md:inline-block" />
          {eyebrow}
          <span className="w-8 h-px bg-accent/30 hidden md:inline-block" />
        </span>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
        {title}
        {titleHighlight && (
          <span className="gold-shimmer"> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-5 md:mt-6 text-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`mt-6 w-16 h-px origin-${align === "center" ? "center" : align}`}
        style={{
          background: `linear-gradient(${align === "right" ? "270deg" : "90deg"}, var(--gold-primary), transparent)`,
        }}
      />
    </motion.div>
  );
}
