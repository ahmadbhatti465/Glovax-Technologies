"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  Search,
  Lightbulb,
  PenTool,
  Code2,
  Bug,
  Rocket,
  LifeBuoy,
} from "lucide-react";

const fallbackSteps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We dive deep into your business, users, and goals through stakeholder interviews and market research to build a solid foundation.",
    icon: "Search",
  },
  {
    number: "02",
    title: "Research",
    description:
      "We validate the approach, map technical constraints, and turn fuzzy requirements into a precise, prioritized plan.",
    icon: "Lightbulb",
  },
  {
    number: "03",
    title: "Design",
    description:
      "We craft intuitive, beautiful interfaces and system architectures that solve real problems and delight users.",
    icon: "PenTool",
  },
  {
    number: "04",
    title: "Development",
    description:
      "We build with clean, scalable code using modern frameworks and best practices for performance and maintainability.",
    icon: "Code2",
  },
  {
    number: "05",
    title: "Testing",
    description:
      "Automated and manual QA, performance checks, and accessibility passes — every release is verified before it ships.",
    icon: "Bug",
  },
  {
    number: "06",
    title: "Launch",
    description:
      "We deploy with CI/CD, monitor in production, and roll out without disruption — on time and on budget.",
    icon: "Rocket",
  },
  {
    number: "07",
    title: "Support",
    description:
      "Post-launch monitoring, fixes, and iteration. We stay with you as your product grows — we don't disappear at launch.",
    icon: "LifeBuoy",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Code: <Code2 className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
  Bug: <Bug className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  LifeBuoy: <LifeBuoy className="w-6 h-6" />,
};

interface ProcessStepsProps {
  steps?: { number: string; title: string; description: string; icon: string }[];
}

export function ProcessSteps({ steps: serverSteps }: ProcessStepsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const steps = serverSteps?.length ? serverSteps : fallbackSteps;

  // Draw the connecting line as the section scrolls into view.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 80%", "end 55%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section className="py-28 md:py-36 lg:py-44 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Our Process"
          title="How we"
          titleHighlight="work"
          subtitle="A battle-tested methodology refined over 100+ projects. We combine agility with rigor to deliver exceptional results on time and on budget."
        />

        <div ref={listRef} className="relative max-w-4xl mx-auto">
          {/* Base line */}
          <div
            aria-hidden
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-neutral-border/60"
          />
          {/* Progress line — draws as you scroll */}
          <motion.div
            aria-hidden
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top"
            style={{
              scaleY: lineScale,
              background:
                "linear-gradient(180deg, var(--teal-deep), var(--teal) 60%, var(--teal-bright))",
              boxShadow: "0 0 12px var(--teal-glow)",
            }}
          />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const isRight = index % 2 === 1;
              return (
                <div
                  key={step.number}
                  className="relative md:grid md:grid-cols-2 md:gap-24"
                >
                  {/* Icon node on the line */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      delay: index * 0.04,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    className="absolute left-6 md:left-1/2 top-0 z-10 -translate-x-1/2"
                  >
                    <div className="group/node relative w-12 h-12 md:w-14 md:h-14 rounded-2xl glass-strong border border-teal/25 flex items-center justify-center text-accent shadow-glow transition-all duration-500 group-hover:shadow-glow-strong">
                      <span className="transition-transform duration-500 group-hover:scale-110">
                        {iconMap[step.icon] || <Search className="w-6 h-6" />}
                      </span>
                      {/* number chip */}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold tracking-wide">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content — alternates sides on desktop, right column on mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={[
                      "pl-20 md:pl-0",
                      isRight
                        ? "md:col-start-2"
                        : "md:col-start-1 md:text-right",
                    ].join(" ")}
                  >
                    <div className="group inline-block w-full md:w-auto rounded-2xl border border-neutral-border bg-surface-raised p-6 md:p-7 hover:border-teal/25 hover:shadow-card transition-all duration-500 text-left">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
