"use client";

import { motion } from "framer-motion";
import { services as fallbackServices } from "@/data/services";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Code2,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState, useRef, MouseEvent } from "react";
import { Service } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
};

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <motion.div
      key={service.id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative p-8 md:p-10 rounded-3xl bg-[#111111] border border-white/[0.06] hover:border-[#D4A017]/20 transition-all duration-500 spotlight-card overflow-hidden"
    >
      {/* Glow border on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,160,23,0.08), transparent 40%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#D4A017]/20 text-accent shadow-[0_0_20px_rgba(212,160,23,0.1)] group-hover:shadow-[0_0_30px_rgba(212,160,23,0.2)] transition-shadow duration-500">
          {iconMap[service.icon] || <Code2 className="w-6 h-6" />}
        </div>

        <h3 className="text-xl md:text-2xl font-semibold mb-4 tracking-tight">{service.title}</h3>

        <p className="text-muted text-sm md:text-base leading-relaxed mb-8">
          {service.description}
        </p>

        <ul className="space-y-3 mb-8">
          {service.features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="text-sm text-muted-foreground flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(212,160,23,0.5)] flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
          Learn More
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}

export function ServicesGrid() {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    fetch("/api/public/services")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setServices(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Services that drive"
          titleHighlight="growth"
          subtitle="From concept to deployment, we deliver end-to-end solutions that transform your business and delight your users."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
