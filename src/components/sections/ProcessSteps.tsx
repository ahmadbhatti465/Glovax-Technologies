"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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

function ConnectorLine({ isVisible, delay }: { isVisible: boolean; delay: number }) {
  return (
    <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full origin-left"
        style={{
          background: "linear-gradient(90deg, rgba(212,160,23,0.4), rgba(212,160,23,0.1))",
        }}
      />
    </div>
  );
}

export function ProcessSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 lg:py-40 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Our Process"
          title="How we"
          titleHighlight="work"
          subtitle="A battle-tested methodology refined over 500+ projects. We combine agility with rigor to deliver exceptional results on time and on budget."
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <ConnectorLine isVisible={isInView} delay={index * 0.15 + 0.5} />
              )}

              <div className="relative">
                <span className="text-7xl md:text-8xl font-bold absolute -top-5 -left-3 select-none"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(212,160,23,0.08)",
                  }}
                >
                  {step.number}
                </span>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(212,160,23,0.05)] group-hover:shadow-[0_0_30px_rgba(212,160,23,0.15)] group-hover:border-[#D4A017]/20 transition-all duration-500">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-semibold mb-3 tracking-tight">{step.title}</h3>

                  <p className="text-sm md:text-base text-muted leading-relaxed">
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
