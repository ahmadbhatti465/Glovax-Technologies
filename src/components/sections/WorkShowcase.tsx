"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ArrowUpRight, ExternalLink, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "@/types";
import { enrichWithCaseStudy } from "@/data/case-studies";
import { isValidExternalUrl } from "@/lib/utils";

interface WorkShowcaseProps {
  projects?: PortfolioItem[];
}

export function WorkShowcase({ projects = [] }: WorkShowcaseProps) {
  const featured = projects.filter((item) => item.featured).map(enrichWithCaseStudy);

  return (
    <section id="work" className="relative overflow-hidden py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Portfolio"
            title="Featured"
            titleHighlight="work"
            subtitle="A selection of projects that showcase our expertise in building products that users love and businesses rely on."
            align="left"
            className="mb-0 md:mb-0"
          />
          {featured.length > 0 && (
            <Link
              href="/work"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
            >
              View all {projects.length} projects
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Generated cover for projects without a screenshot: grid, glow, monogram, stack. */
function ProjectCover({ project }: { project: PortfolioItem }) {
  const monogram = project.title
    .split(/[\s&-]+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-canvas-surface">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(37, 99, 235, 0.22), transparent 70%), radial-gradient(ellipse 35% 35% at 65% 60%, rgba(168, 85, 247, 0.16), transparent 70%)",
        }}
      />
      <div className="dot-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000,transparent_75%)]" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.1] bg-canvas-elevated/80 text-2xl font-semibold tracking-tight text-brand-textPrimary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_40px_-12px_rgba(37,99,235,0.45)] backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
        {monogram || "G"}
      </span>
      <div className="relative flex flex-wrap justify-center gap-1.5 px-6">
        {(project.technologies || []).slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/[0.08] bg-canvas-base/60 px-2 py-0.5 font-mono text-[11px] text-brand-textSecondary backdrop-blur-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: PortfolioItem }) {
  const hasLink = isValidExternalUrl(project.link);
  const hasImage = Boolean(project.image);

  return (
    <SpotlightCard className="group flex h-full flex-col p-2">
      {/* Screenshot in a minimal browser frame */}
      <Link
        href={`/work/${project.id}`}
        aria-label={`${project.title} case study`}
        className="relative block overflow-hidden rounded-xl border border-white/[0.06] bg-canvas-elevated"
      >
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3.5 py-2.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/[0.12]" />
          <span className="h-2 w-2 rounded-full bg-white/[0.12]" />
          <span className="h-2 w-2 rounded-full bg-white/[0.12]" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden">
          {hasImage ? (
            <Image
              src={project.image!}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <ProjectCover project={project} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas-base/70 via-transparent to-transparent" />
          <span className="absolute left-3 top-3 rounded-full border border-white/[0.08] bg-canvas-base/70 px-2.5 py-1 font-mono text-[11px] text-brand-textSecondary backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-textMuted">
          <span className="text-brand-textSecondary">{project.client}</span>
          {project.industry && (
            <>
              <span aria-hidden>·</span>
              <span>{project.industry}</span>
            </>
          )}
          {project.timeline && (
            <>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {project.timeline}
              </span>
            </>
          )}
        </div>

        <h3 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-brand-textPrimary">
          {project.title}
        </h3>

        {project.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-brand-textSecondary md:text-[0.9375rem]">
            {project.description}
          </p>
        )}

        {(project.results?.length ?? 0) > 0 && (
          <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-5">
            {project.results.slice(0, 3).map((result) => (
              <li key={result} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-textSecondary">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-electricBright" />
                {result}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-1.5">
          {(project.technologies || []).slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-brand-textSecondary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
          <Link
            href={`/work/${project.id}`}
            className="group/btn inline-flex items-center gap-1.5 text-sm font-medium text-brand-textPrimary"
          >
            Read case study
            <ArrowUpRight className="h-4 w-4 text-accent-electricBright transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden />
          </Link>
          {hasLink && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-brand-textSecondary transition-colors hover:text-brand-textPrimary"
            >
              Live site
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
