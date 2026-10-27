"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating "back to top" button. Appears after meaningful scroll,
 * positioned clear of the mobile sticky CTA bar.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > 600);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-24 lg:bottom-6 right-4 md:right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-white/[0.08] bg-canvas-surface/80 text-brand-textSecondary shadow-card backdrop-blur-md",
        "transition-[opacity,transform,color,background-color] duration-300 ease-out hover:bg-canvas-elevated hover:text-brand-textPrimary",
        visible ? "opacity-100 translate-y-0 scale-100" : "pointer-events-none opacity-0 translate-y-4 scale-90"
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
