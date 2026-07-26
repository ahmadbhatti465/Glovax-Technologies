"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Use requestIdleCallback to defer particle creation to idle time
    const create = () => {
      const p = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 10,
      }));
      setParticles(p);
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(create);
      return () => cancelIdleCallback(id);
    } else {
      const timeout = setTimeout(create, 200);
      return () => clearTimeout(timeout);
    }
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-accent/30"
          style={{ left: `${p.x}%`, bottom: "-5%" }}
          animate={{
            y: [0, -window.innerHeight * 1.1],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
