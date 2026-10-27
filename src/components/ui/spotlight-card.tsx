"use client";

import { useCallback, useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = ComponentPropsWithoutRef<"div"> & {
  /** Render the static hairline surface only (no cursor backlight). */
  static?: boolean;
};

/**
 * Card surface with a cursor-tracked backlight and border glow.
 *
 * Pointer position is written to `--spot-x` / `--spot-y` on the element,
 * coalesced to one write per animation frame. Nothing goes through React
 * state, so hovering never re-renders the tree (keeps INP flat). The
 * visuals live in the `.spotlight` CSS utility in globals.css.
 */
export function SpotlightCard({
  className,
  children,
  static: isStatic = false,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const handleMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e);
      if (isStatic || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
        el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
      });
    },
    [isStatic, onPointerMove]
  );

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (!isStatic && e.pointerType === "mouse") e.currentTarget.dataset.active = "true";
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        cancelAnimationFrame(frame.current);
        e.currentTarget.dataset.active = "false";
      }}
      className={cn(
        "spotlight rounded-2xl border border-white/[0.06] bg-canvas-surface",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-colors duration-300",
        "hover:bg-canvas-elevated/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
