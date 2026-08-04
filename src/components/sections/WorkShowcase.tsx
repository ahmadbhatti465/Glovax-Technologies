"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "@/types";

interface WorkShowcaseProps {
  projects?: PortfolioItem[];
}

export function WorkShowcase({ projects = [] }: WorkShowcaseProps) {
  const featured = projects.filter((item) => item.featured);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-section-alt relative overflow-hidden">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

          {<motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <Link href="/work" className="group block">
              <div className="relative aspect-[16/6] md:aspect-[21/9] rounded-3xl overflow-hidden border border-neutral-border">
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
                        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-background shadow-[0_0_20px_var(--teal-glow)]"
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
          </motion.div>}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: PortfolioItem }) {
  const hasLink = Boolean(project.link);

  const cardContent = (
    <>
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-card border border-neutral-border mb-6 group">
        <Image
          src={project.image || "/images/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 text-xs font-medium glass rounded-full">
            {project.category}
          </span>
        </div>

        <div className="absolute bottom-5 right-5 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_var(--teal-glow)]">
          {hasLink ? (
            <ExternalLink className="w-5 h-5 text-accent" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-accent" />
          )}
        </div>
      </div>

      <div className="flex items-start justify-between px-1">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-1.5 group-hover:text-accent transition-colors duration-300 tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.client}
          </p>
        </div>
      </div>

      {(project.results?.length ?? 0) > 0 && (
        <div className="mt-5 px-1">
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

      <div className="mt-5 flex flex-wrap gap-2 px-1">
        {(project.technologies || []).slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs font-medium bg-card border border-teal/20 rounded-full text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </>
  );

  if (hasLink) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {cardContent}
      </a>
    );
  }

  return <Link href={`/work#${project.id}`} className="group block">{cardContent}</Link>;
}
