"use client";

import { motion } from "framer-motion";
import { portfolioItems as fallbackPortfolio } from "@/data/portfolio";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PortfolioItem } from "@/types";

export function WorkShowcase() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackPortfolio);

  useEffect(() => {
    fetch("/api/public/portfolio")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPortfolioItems(data);
      })
      .catch(() => {});
  }, []);

  const featured = portfolioItems.filter((item) => item.featured);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-[#0D0D0D] relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)",
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
              <div className="relative aspect-[16/6] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/[0.06]">
                <Image
                  src="/images/portfolio/cta-bg.jpg"
                  alt="Portfolio background"
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/60 to-[#0A0A0A]/40 group-hover:from-[#0A0A0A]/80 group-hover:via-[#0A0A0A]/50 transition-all duration-700" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex -space-x-4 mb-6">
                    {featured.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#0A0A0A] shadow-[0_0_20px_rgba(212,160,23,0.15)]"
                      >
                        <Image
                          src={project.image || "/images/placeholder.jpg"}
                          alt={project.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 tracking-wide">
                    View all {portfolioItems.length} projects
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
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-[#1A1A1A] border border-white/[0.06] mb-6 group">
        <Image
          src={project.image || "/images/placeholder.jpg"}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 text-xs font-medium glass rounded-full">
            {project.category}
          </span>
        </div>

        <div className="absolute bottom-5 right-5 w-12 h-12 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 shadow-[0_0_20px_rgba(212,160,23,0.15)]">
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

      <div className="mt-5 flex flex-wrap gap-2 px-1">
        {(project.technologies || []).slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs font-medium bg-[#1A1A1A] border border-white/[0.06] rounded-full text-muted-foreground"
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
