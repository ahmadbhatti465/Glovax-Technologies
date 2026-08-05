"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "@/types";
import { enrichWithCaseStudy } from "@/data/case-studies";

interface WorkShowcaseProps {
  projects?: PortfolioItem[];
}

export function WorkShowcase({ projects = [] }: WorkShowcaseProps) {
  const featured = projects.filter((item) => item.featured).map(enrichWithCaseStudy);

  return (
    <section id="work" className="py-28 md:py-36 lg:py-44 bg-section-alt relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--teal-glow) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <SectionHeader
          eyebrow="Portfolio"
          title="Featured"
          titleHighlight="Work"
          subtitle="A selection of projects that showcase our expertise in building products that users love and businesses rely on."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}

          {featured.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <Link href="/work" className="group block">
                <div className="relative aspect-[16/7] md:aspect-[21/9] rounded-3xl overflow-hidden border border-neutral-border bg-surface-raised">
                  <Image
                    src="/images/placeholder.svg"
                    alt="Portfolio background"
                    fill
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40 group-hover:from-background/80 group-hover:via-background/50 transition-all duration-700" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex -space-x-4 mb-6">
                      {featured.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-background shadow-glow"
                        >
                          <Image
                            src={project.image || "/images/placeholder.svg"}
                            alt={project.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 tracking-wide">
                      View all {projects.length} projects
                    </p>
                    <div className="inline-flex items-center gap-2 text-xl md:text-2xl font-semibold group-hover:text-accent transition-colors duration-300">
                      See Full Portfolio
                      <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl md:rounded-3xl border border-neutral-border bg-card overflow-hidden shadow-card">
      {/* chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-neutral-border bg-brand-bg-hi/60">
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/80" />
        </div>
        <div className="mx-auto flex-1 max-w-[180px] md:max-w-[220px]">
          <div className="h-5 rounded-full bg-background/60 border border-neutral-border" />
        </div>
      </div>
      {children}
    </div>
  );
}

function ProjectCard({ project }: { project: PortfolioItem }) {
  const hasLink = Boolean(project.link);
  const hasImage = Boolean(project.image);

  return (
    <div className="group rounded-3xl bg-surface-raised border border-neutral-border hover:border-teal/25 transition-all duration-500 p-3 md:p-4 hover:shadow-card">
      <BrowserFrame>
        <div className="relative aspect-[16/10] overflow-hidden group/shot">
          {hasImage ? (
            <Image
              src={project.image!}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--teal) 12%, var(--brand-bg-hi)) 0%, var(--brand-bg-hi) 55%, color-mix(in srgb, var(--azure) 10%, var(--brand-bg-hi)) 100%)",
              }}
            />
          )}

          {/* soft bottom gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-transparent" />

          {/* industry badge */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4">
            <span className="px-3.5 py-1.5 text-[11px] md:text-xs font-medium glass rounded-full text-muted">
              {project.category}
            </span>
          </div>

          {/* hover action chip */}
          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-strong text-xs font-semibold text-accent opacity-0 translate-y-3 group-hover/shot:opacity-100 group-hover/shot:translate-y-0 transition-all duration-500 shadow-glow">
              {hasLink ? "Visit website" : "Open case study"}
              {hasLink ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>
      </BrowserFrame>

      <div className="p-3 md:p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-1 group-hover:text-accent transition-colors duration-300 tracking-tight">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2.5">
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
          </div>
        </div>

        {project.description && (
          <p className="mt-4 text-sm md:text-[15px] text-muted leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {(project.results?.length ?? 0) > 0 && (
          <div className="mt-5">
            <div className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
              Results
            </div>
            <ul className="space-y-2.5">
              {project.results.slice(0, 3).map((result) => (
                <li
                  key={result}
                  className="flex items-start gap-2.5 text-sm text-muted leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--teal-glow)] flex-shrink-0 mt-1.5" />
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(project.technologies || []).slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium bg-card border border-teal/15 rounded-full text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {hasLink && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-cta text-accent-foreground text-sm font-semibold shadow-glow hover:shadow-glow-strong transition-all duration-300 active:scale-[0.98]"
            >
              Visit Website
              <ExternalLink className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          )}
          <Link
            href={`/work/${project.id}`}
            className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-muted text-foreground hover:border-teal/40 hover:text-accent hover:shadow-glow transition-all duration-300 text-sm font-medium active:scale-[0.98]"
          >
            Read Case Study
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
