"use client";

import { motion } from "framer-motion";
import { portfolioItems } from "@/data/portfolio";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function WorkShowcase() {
  const featured = portfolioItems.filter((item) => item.featured);

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Portfolio"
          title="Featured"
          titleHighlight="Work"
          subtitle="A selection of projects that showcase our expertise in building products that users love and businesses rely on."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={`/work#${project.id}`} className="group block">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-surface-raised border border-border mb-5">
                  {/* Project Image */}
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 text-xs font-medium bg-background/80 backdrop-blur-sm rounded-full border border-border">
                      {project.category}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.client}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-medium bg-surface-raised border border-border rounded-full text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <Link href="/work" className="group block">
              <div className="relative aspect-[16/6] md:aspect-[21/9] rounded-2xl overflow-hidden border border-border">
                {/* Background image */}
                <Image
                  src="/images/portfolio/cta-bg.jpg"
                  alt="Portfolio background"
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-background/80 group-hover:bg-background/70 transition-colors duration-500" />

                {/* Floating project thumbnails */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex -space-x-3 mb-4">
                    {featured.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-accent/20"
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    View all {portfolioItems.length} projects
                  </p>
                  <div className="inline-flex items-center gap-2 text-xl md:text-2xl font-semibold group-hover:text-accent transition-colors">
                    See Full Portfolio
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
