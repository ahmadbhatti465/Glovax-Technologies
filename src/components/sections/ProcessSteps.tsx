"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Search, PenTool, Code, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We dive deep into your business, users, and goals through research and stakeholder interviews to build a solid foundation.",
    icon: Search,
  },
  {
    number: "02",
    title: "Design",
    description:
      "We craft intuitive, beautiful interfaces and system architectures that solve real problems and delight users.",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Develop",
    description:
      "We build with clean, scalable code using modern frameworks and best practices for performance and maintainability.",
    icon: Code,
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We deploy, monitor, and optimize your product with CI/CD pipelines, ensuring long-term success and growth.",
    icon: Rocket,
  },
];

export function ProcessSteps() {
  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Our Process"
          title="How we"
          titleHighlight="work"
          subtitle="A battle-tested methodology refined over 500+ projects. We combine agility with rigor to deliver exceptional results on time and on budget."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px">
                  <div className="w-full h-full bg-border" />
                </div>
              )}

              <div className="relative">
                <span className="text-6xl md:text-7xl font-bold text-white/[0.03] absolute -top-4 -left-2">
                  {step.number}
                </span>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>

                  <p className="text-sm text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
