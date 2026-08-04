"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
  return (
    <section className="py-14 md:py-16 border-b border-neutral-border bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Upwork rating badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-surface-raised border border-neutral-border mb-8">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent drop-shadow-[0_0_4px_var(--teal-glow)]" />
              ))}
            </span>
            <span className="text-sm font-semibold">Top Rated</span>
            <span className="text-sm text-muted-foreground">on Upwork</span>
          </div>

          <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium mb-8">
            The stack behind your product
          </p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
            {techStack.map((tech) => (
              <motion.span
                key={tech}
                variants={item}
                className="px-4 py-2 rounded-full bg-surface-raised border border-neutral-border text-sm font-medium text-muted-foreground hover:text-teal hover:border-teal/40 transition-colors duration-300"
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
