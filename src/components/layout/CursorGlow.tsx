"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Subtle cursor-following glow. Desktop, fine-pointer, motion-OK devices only.
 * Uses a single fixed element driven by requestAnimationFrame (transform-only,
 * pointer-events: none) so it stays off the paint path between frames.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const large = window.matchMedia("(min-width: 1024px)").matches;
    if (!fine || reduced || !large) return;

    setEnabled(true);
    const glow = ref.current;
    if (!glow) return;

    let raf = 0;
    let tx = -9999;
    let ty = -9999;
    let cx = -9999;
    let cy = -9999;

    const update = () => {
      tx += (cx - tx) * 0.12;
      ty += (cy - ty) * 0.12;
      glow.style.transform = `translate3d(${tx - 260}px, ${ty - 260}px, 0)`;
      raf = requestAnimationFrame(update);
    };

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (tx === -9999) {
        tx = cx;
        ty = cy;
      }
    };

    const onLeave = () => {
      tx = -9999;
      ty = -9999;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return <div ref={ref} aria-hidden className="cursor-glow" />;
}
