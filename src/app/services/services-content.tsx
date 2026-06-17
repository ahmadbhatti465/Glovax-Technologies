"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { services as fallbackServices } from "@/data/services";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Service } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Cloud: <Cloud className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
};

export default function ServicesContent() {
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
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Services"
            title="Solutions for every"
            titleHighlight="challenge"
            subtitle="We offer end-to-end digital services designed to accelerate your growth, reduce costs, and future-proof your business."
            align="left"
          />

          <div className="space-y-8">
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
                className="group p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      {iconMap[service.icon]}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                          {service.title}
                        </h3>
                        <p className="text-muted leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <MagneticButton
                        href="/contact"
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:text-accent-hover"
                      >
                        Discuss this service
                        <ArrowUpRight className="w-4 h-4" />
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
