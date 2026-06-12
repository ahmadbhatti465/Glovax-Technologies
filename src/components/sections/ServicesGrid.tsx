"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
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

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Palette: <Palette className="w-6 h-6" />,
};

export function ServicesGrid() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Services that drive"
          titleHighlight="growth"
          subtitle="From concept to deployment, we deliver end-to-end solutions that transform your business and delight your users."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative p-8 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-500"
            >
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent">
                {iconMap[service.icon] || <Code2 className="w-6 h-6" />}
              </div>

              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>

              <p className="text-muted text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.slice(0, 3).map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
