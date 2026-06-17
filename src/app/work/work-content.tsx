"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { portfolioItems as fallbackPortfolio } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PortfolioItem } from "@/types";

export default function WorkContent() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackPortfolio);

  useEffect(() => {
    fetch("/api/public/portfolio")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPortfolioItems(data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Portfolio"
            title="Selected"
            titleHighlight="Projects"
            subtitle="A curated collection of our finest work across web, mobile, AI, and cloud infrastructure."
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems.map((project, index) => (
              <WorkCard key={project.id} project={project} index={index} />
            ))}
          </div>
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
  const hasLink = Boolean(project.link);

  const cardBody = (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      id={project.id}
      className="group"
    >
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-raised border border-border mb-5">
        <Image
          src={project.image || "/images/placeholder.jpg"}
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

      <h3 className="text-xl md:text-2xl font-semibold mb-2">{project.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{project.client}</p>
      <p className="text-sm text-muted leading-relaxed mb-4">
        {project.description}
      </p>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Results
        </h4>
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

      {hasLink && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Visit Live Project
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </motion.article>
  );

  if (hasLink) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {cardBody}
      </a>
    );
  }

  return cardBody;
}
