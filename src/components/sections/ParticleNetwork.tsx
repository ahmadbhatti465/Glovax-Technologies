"use client";

import { useEffect, useRef } from "react";

/**
 * Constellation particle-network background — modeled on the techietribe
 * early-access hero: tiny dots connected by faint lines that drift and bounce.
 *
 * Canvas-based so it's dependency-free, off the main thread paint path after
 * setup, and gated to a static frame when the user prefers reduced motion.
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  o: number;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const LINK_DIST = 110;
    const LINK_ALPHA = 0.4;

    let particles: Particle[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Density ~1 particle per 9,000px², clamped for very small/large screens.
      const count = Math.min(90, Math.max(35, Math.floor((w * h) / 9000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.6 + Math.random() * 1.1,
        o: 0.12 + Math.random() * 0.35,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Connecting lines — fade with distance like a constellation.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * LINK_ALPHA;
            ctx.strokeStyle = `rgba(30, 218, 198, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots — near-white, low opacity.
      for (const p of particles) {
        ctx.fillStyle = `rgba(244, 250, 248, ${p.o.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      if (!reduced) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          // Bounce off edges (matches tsParticles outModes: "bounce").
          if (p.x < 0 || p.x > w) {
            p.vx *= -1;
            p.x = Math.max(0, Math.min(w, p.x));
          }
          if (p.y < 0 || p.y > h) {
            p.vy *= -1;
            p.y = Math.max(0, Math.min(h, p.y));
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
    />
  );
}
