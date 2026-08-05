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
import { useRef, MouseEvent } from "react";
import { Service } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-7 h-7" />,
  Smartphone: <Smartphone className="w-7 h-7" />,
  Brain: <Brain className="w-7 h-7" />,
  Cloud: <Cloud className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
  Palette: <Palette className="w-7 h-7" />,
};

// Per-service accent colors (brand palette): AI/ML → mint, Digital Marketing → amber,
// everything else → teal.
const serviceAccent: Record<string, string> = {
  Brain: "bg-success/10 border-success/30 text-success",
  TrendingUp: "bg-warning/10 border-warning/30 text-warning",
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
      whileHover={{ y: -8 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative p-8 md:p-10 rounded-3xl bg-surface-raised border border-neutral-border hover:border-teal/25 hover:shadow-card transition-all duration-500 spotlight-card card-shine gradient-border overflow-hidden"
    >
      {/* Watermark index */}
      <span
        aria-hidden
        className="absolute top-6 right-7 text-5xl font-bold select-none opacity-[0.06] group-hover:opacity-10 transition-opacity duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Cursor-tracked glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--teal-glow), transparent 40%)",
        }}
      />

      <div className="relative z-10">
        <div className={`mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${serviceAccent[service.icon] || "bg-teal/10 border-teal/25 text-accent"} shadow-glow group-hover:shadow-glow-strong group-hover:scale-105 transition-all duration-500`}>
          {iconMap[service.icon] || <Code2 className="w-7 h-7" />}
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
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--teal-glow)] flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors duration-500">
          Learn More
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.div>
  );
}

interface ServicesGridProps {
  services?: Service[];
}

export function ServicesGrid({ services: serverServices }: ServicesGridProps) {
  const services = serverServices?.length ? serverServices : fallbackServices;

  return (
    <section id="services" className="py-28 md:py-36 lg:py-44 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Services that drive"
          titleHighlight="growth"
          subtitle="From concept to deployment, we deliver end-to-end solutions that transform your business and delight your users."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
