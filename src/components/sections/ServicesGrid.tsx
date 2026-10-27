"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services as fallbackServices } from "@/data/services";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  Code2,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Service } from "@/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
};

// Bento rhythm on a 3-column grid, repeating every 4 cards:
// wide + narrow, then narrow + wide. Every pair fills a row exactly; an odd
// trailing card spans the full row so the grid never leaves a hole.
function spanFor(index: number, total: number): "wide" | "narrow" | "full" {
  if (total % 2 === 1 && index === total - 1) return "full";
  return index % 4 === 0 || index % 4 === 3 ? "wide" : "narrow";
}

function ServiceCard({ service, index, total }: { service: Service; index: number; total: number }) {
  const Icon = iconMap[service.icon] ?? Code2;
  const span = spanFor(index, total);
  const wide = span !== "narrow";
  const isAI = service.icon === "Brain";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        span === "wide" && "lg:col-span-2",
        span === "full" && "md:col-span-2 lg:col-span-3"
      )}
    >
      <SpotlightCard className="group h-full">
        <Link
          href="/services"
          className="relative flex h-full flex-col rounded-2xl p-7 md:p-8"
          aria-label={`${service.title} — learn more`}
        >
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-xl border bg-canvas-elevated",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors duration-300",
                isAI
                  ? "border-accent-neon/30 text-accent-neon"
                  : "border-white/[0.08] text-brand-textPrimary group-hover:border-accent-electricBright/40 group-hover:text-accent-electricBright"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-mono text-xs text-brand-textMuted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-8 text-lg md:text-xl font-semibold tracking-tight text-brand-textPrimary">
            {service.title}
            {isAI && (
              <span className="ml-2 align-middle rounded-full border border-accent-neon/30 bg-accent-neon/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-neon">
                Core
              </span>
            )}
          </h3>
          <p className="mt-3 max-w-xl text-sm md:text-[0.9375rem] leading-relaxed text-brand-textSecondary">
            {service.description}
          </p>

          <ul className={cn("mt-6 grid gap-2.5", wide && "sm:grid-cols-2")}>
            {service.features.slice(0, wide ? 4 : 3).map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm text-brand-textSecondary">
                <span className="h-1 w-1 shrink-0 rounded-full bg-brand-textMuted transition-colors duration-300 group-hover:bg-accent-electricBright" />
                {feature}
              </li>
            ))}
          </ul>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-brand-textSecondary transition-colors duration-300 group-hover:text-brand-textPrimary">
            Learn more
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}

interface ServicesGridProps {
  services?: Service[];
}

export function ServicesGrid({ services: serverServices }: ServicesGridProps) {
  const services = serverServices?.length ? serverServices : fallbackServices;

  return (
    <section id="services" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <SectionHeader
          eyebrow="What we do"
          title="Services that drive"
          titleHighlight="growth"
          subtitle="From concept to deployment, we deliver end-to-end solutions that transform your business and delight your users."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} total={services.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
