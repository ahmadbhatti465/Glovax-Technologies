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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col ${alignClasses[align]} max-w-4xl mx-auto mb-16 md:mb-20 ${className}`}
    >
      {eyebrow && (
        <span className="text-accent text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
        {title}
        {titleHighlight && (
          <span className="gradient-text"> {titleHighlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 md:mt-6 text-muted text-base md:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
