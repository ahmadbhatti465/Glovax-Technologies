"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  withArrow?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-12 px-7 text-base",
};

const variantClasses = {
  // Electric fill with a lit top edge and a soft accent bloom on hover.
  primary:
    "bg-accent-electric text-white font-medium " +
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_0_0_1px_rgba(37,99,235,0.6),0_8px_24px_-8px_rgba(37,99,235,0.6)] " +
    "hover:bg-accent-electricBright hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_0_0_1px_rgba(59,130,246,0.8),0_12px_36px_-8px_rgba(37,99,235,0.75)]",
  // Hairline glass — the quiet secondary action.
  outline:
    "bg-white/[0.03] text-brand-textPrimary font-medium border border-white/[0.08] backdrop-blur-sm " +
    "hover:bg-white/[0.06] hover:border-white/[0.14]",
  ghost: "text-brand-textSecondary font-medium hover:text-brand-textPrimary",
};

/**
 * CTA button with a subtle magnetic pull toward the cursor.
 * Offset is held in framer motion values (no React state), so pointer
 * movement animates on the compositor without re-rendering.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  withArrow = false,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 300, damping: 20, mass: 0.4 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.12);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.18);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full",
    "transition-[background-color,border-color,box-shadow,color] duration-200",
    "active:scale-[0.98] select-none disabled:pointer-events-none disabled:opacity-60",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const content = (
    <motion.span className="relative z-10 inline-flex items-center gap-2" style={{ x, y }}>
      {children}
      {withArrow && (
        <ArrowUpRight
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      )}
    </motion.span>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <Link
        href={href}
        className={classes}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        onPointerMove={handlePointerMove}
        onPointerLeave={reset}
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
      disabled={disabled}
      aria-busy={disabled || undefined}
      className={classes}
      ref={ref as React.RefObject<HTMLButtonElement>}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {content}
    </button>
  );
}
