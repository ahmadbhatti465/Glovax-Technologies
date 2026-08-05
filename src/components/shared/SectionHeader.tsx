"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className = "",
  as: Tag = "h2",
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
      className={`flex flex-col ${alignClasses[align]} max-w-4xl mx-auto mb-16 md:mb-24 ${className}`}
    >
      {eyebrow && (
        <span className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-6 inline-flex items-center gap-3">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-accent/40 hidden md:inline-block" />
          {eyebrow}
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-accent/40 hidden md:inline-block" />
        </span>
      )}
      <Tag className="text-3xl sm:text-4xl md:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-tight leading-[1.05] text-balance">
        {title}
        {titleHighlight && (
          <span className="teal-shimmer"> {titleHighlight}</span>
        )}
      </Tag>
      {subtitle && (
        <p className="mt-5 md:mt-6 text-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}

      {/* Teal accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`mt-7 w-16 h-px origin-${align === "center" ? "center" : align}`}
        style={{
          background: `linear-gradient(${align === "right" ? "270deg" : "90deg"}, var(--teal), transparent)`,
        }}
      />
    </motion.div>
  );
}
