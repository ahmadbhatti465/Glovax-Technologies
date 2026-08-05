"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  withArrow?: boolean;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  withArrow = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-8 py-3.5 text-base",
    lg: "px-10 py-4 text-lg",
  };

  const variantClasses = {
    primary:
      "gradient-cta text-accent-foreground font-semibold shadow-glow hover:shadow-glow-strong active:scale-[0.98]",
    outline:
      "border border-teal-muted text-foreground hover:border-teal/50 hover:text-accent bg-transparent hover:shadow-glow active:scale-[0.98]",
    ghost: "text-foreground hover:text-accent bg-transparent",
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * 0.15;
    const distanceY = (e.clientY - centerY) * 0.15;

    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const classes = `
    group relative inline-flex items-center justify-center gap-2
    rounded-full transition-all duration-300 overflow-hidden
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  // Soft sheen for the primary fill — keeps the button feeling alive on hover.
  const sheen =
    variant === "primary" ? (
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.28),transparent_65%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
    ) : null;

  const content = (
    <>
      {sheen}
      <motion.span
        className="relative z-10 inline-flex items-center gap-2"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      >
        {children}
        {withArrow && (
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        )}
      </motion.span>
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      ref={ref as React.RefObject<HTMLButtonElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </button>
  );
}
