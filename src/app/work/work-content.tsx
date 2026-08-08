"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { enrichWithCaseStudy } from "@/data/case-studies";
import { isValidExternalUrl } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface WorkContentProps {
  projects?: PortfolioItem[];
  faqs?: FAQItem[];
  lastUpdated?: Date | null;
}

export default function WorkContent({
  projects = [],
  faqs = [],
  lastUpdated,
}: WorkContentProps) {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Portfolio", href: "/work" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Portfolio"
            title="Selected"
            titleHighlight="Projects"
            subtitle="Glovax Technologies builds web apps, mobile platforms, AI solutions, and cloud infrastructure for clients worldwide. Below is a curated selection of projects by category."
            align="left"
          />

          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-8 -mt-8">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <WorkCard
                key={project.id}
                project={enrichWithCaseStudy(project)}
                index={index}
              />
            ))}
          </div>

          {faqs.length > 0 && (
            <section aria-labelledby="work-faq" className="mt-24">
              <SectionHeader
                eyebrow="FAQ"
                title="Common questions about our"
                titleHighlight="work"
                subtitle="Everything you need to know before exploring our portfolio and starting a similar project."
                align="left"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="p-6 rounded-2xl bg-surface border border-border"
                  >
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function WorkCard({
  project,
  index,
}: {
  project: PortfolioItem;
  index: number;
}) {
  const hasLink = isValidExternalUrl(project.link);

  const cardBody = (
    <>
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-raised border border-border mb-5">
        <Image
          src={project.image || "/images/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500" />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full border border-border">
            {project.category}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {hasLink ? (
            <ExternalLink className="w-4 h-4" />
          ) : (
            <ArrowUpRight className="w-4 h-4" />
          )}
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-2">{project.title}</h2>
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <p className="text-sm text-muted-foreground">{project.client}</p>
        {project.timeline && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-1 h-1 rounded-full bg-accent/40" />
            <Clock className="w-3 h-3 text-accent/70" />
            {project.timeline}
          </span>
        )}
        {project.industry && (
          <span className="inline-flex items-center text-xs text-muted-foreground">
            <span className="w-1 h-1 rounded-full bg-accent/40 mr-2" />
            {project.industry}
          </span>
        )}
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Results
        </h3>
        <ul className="space-y-1">
          {project.results.map((result) => (
            <li
              key={result}
              className="text-sm text-foreground/80 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {result}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs font-medium bg-surface-raised border border-border rounded-full text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <Link
          href={`/work/${project.id}`}
          className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-cta text-accent-foreground text-sm font-semibold shadow-glow hover:shadow-glow-strong transition-all duration-300 active:scale-[0.98]"
        >
          Read Case Study
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
        {hasLink && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
          >
            Visit Website
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <div className="group h-full rounded-2xl bg-surface-raised border border-neutral-border p-3 md:p-4 hover:border-teal/25 hover:shadow-card transition-all duration-500">
        {cardBody}
      </div>
    </motion.div>
  );
}
