"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { clientLogos } from "@/lib/constants";

// Real technologies the team ships with — honest social proof for technical buyers.
const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "FastAPI",
  "LangChain",
  "OpenAI",
  "RAG",
  "AWS",
  "Docker",
  "PostgreSQL",
];

const proofNumbers = [
  { value: "120", suffix: "+", label: "Projects delivered" },
  { value: "30", suffix: "+", label: "Countries served" },
  { value: "12", suffix: "+", label: "Industries served" },
  { value: "5", suffix: "+", label: "Years of experience" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function TrustBar() {
  const doubledLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-20 border-b border-neutral-border bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Upwork rating badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-raised border border-neutral-border mb-10 shadow-card">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent drop-shadow-[0_0_4px_var(--teal-glow)]" />
              ))}
            </span>
            <span className="text-sm font-semibold">Top Rated</span>
            <span className="text-sm text-muted-foreground">on Upwork</span>
          </div>

          {/* Client logo marquee */}
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium mb-8">
            Trusted by innovative teams worldwide
          </p>

          <div className="relative mb-10 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            {/* w-max so the -50% translate loops exactly one logo set */}
            <div className="flex w-max animate-marquee">
              {doubledLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
                >
                  <span className="text-lg md:text-xl font-semibold text-muted-foreground/30 hover:text-muted-foreground/70 transition-colors duration-500 whitespace-nowrap tracking-wide">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Proof numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {proofNumbers.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="gradient-text">{stat.value}</span>
                  <span className="gradient-text">{stat.suffix}</span>
                </div>
                <p className="mt-2 text-xs md:text-sm text-muted-foreground tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack divider */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-14 pt-10 border-t border-neutral-border/60 text-center"
        >
          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium mb-8">
            The stack behind your product
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={item}
                className="px-4 py-2 rounded-full bg-surface-raised border border-neutral-border text-sm font-medium text-muted-foreground hover:text-accent hover:border-teal/40 hover:shadow-glow transition-all duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
