"use client";

import { useEffect, useRef } from "react";

/**
 * Reactive backlight for the hero: a soft electric/neon bloom that trails
 * the cursor across the section. Writes CSS variables once per frame with
 * eased interpolation — no React state, transform/opacity-free paint only
 * on a single layer. Disabled for touch and reduced-motion users.
 */
export function HeroBacklight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      el.style.setProperty("--glow-x", `${cx}px`);
      el.style.setProperty("--glow-y", `${cy}px`);
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      tx = e.clientX - rect.left;
      ty = e.clientY - rect.top;
      if (!el.dataset.active) {
        cx = tx;
        cy = ty;
        el.dataset.active = "true";
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onLeave = () => {
      delete el.dataset.active;
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-700 data-[active=true]:opacity-100"
      style={{
        background:
          "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 30%), rgba(37, 99, 235, 0.13), rgba(168, 85, 247, 0.05) 40%, transparent 70%)",
      }}
    />
  );
}
