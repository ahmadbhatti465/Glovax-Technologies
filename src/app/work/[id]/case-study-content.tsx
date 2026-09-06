"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Check,
  Clock,
  Target,
  Lightbulb,
  Quote,
  Star,
  Lock,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PortfolioItem } from "@/types";
import { isValidExternalUrl } from "@/lib/utils";

interface CaseStudyContentProps {
  project: PortfolioItem;
  related: PortfolioItem[];
  isPreview?: boolean;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-neutral-border text-xs sm:text-sm text-muted">
      {icon}
      {label}
    </span>
  );
}

export default function CaseStudyContent({ project, related, isPreview }: CaseStudyContentProps) {
  const hasLink = isValidExternalUrl(project.link);
  const hasClientSite = isValidExternalUrl(project.clientWebsite);
  const steps = project.process ?? [];
  const keyFeatures = project.keyFeatures ?? [];
  const gallery = project.gallery ?? [];
  const results = project.results ?? [];
  const hasScreenshot = Boolean(project.image);
  const testimonial = project.testimonial || (project.testimonialQuote ? {
    quote: project.testimonialQuote,
    author: project.testimonialAuthor || "Client",
    role: project.testimonialRole || "",
    company: project.testimonialCompany || project.client || "",
    rating: project.testimonialRating || 5,
  } : undefined);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          {/* Draft Preview Warning Banner */}
          {(isPreview || project.status !== "published") && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <strong>Admin Preview Mode:</strong> This project is currently a <strong>{(project.status || "draft").toUpperCase()}</strong>. It is not indexable by search engines until published.
              </div>
            </div>
          )}

          <Breadcrumbs
            items={[
              { label: "Work", href: "/work" },
              { label: project.title },
            ]}
          />

          {/* ===== Hero Section ===== */}
          <Reveal className="mt-8">
            <div className="max-w-3xl">
              <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-4">
                Case Study · {project.category}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.06]">
                {project.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <MetaChip
                  icon={<Clock className="w-4 h-4 text-accent" />}
                  label={project.timeline ?? "Timeline on request"}
                />
                {project.industry && (
                  <MetaChip
                    icon={<Target className="w-4 h-4 text-accent" />}
                    label={project.industry}
                  />
                )}
                {project.projectYear && (
                  <MetaChip
                    icon={<Calendar className="w-4 h-4 text-accent" />}
                    label={`Delivered · ${project.projectYear}`}
                  />
                )}
                {project.location && (
                  <MetaChip
                    icon={<MapPin className="w-4 h-4 text-accent" />}
                    label={project.location}
                  />
                )}
                <MetaChip
                  icon={<ArrowUpRight className="w-4 h-4 text-accent" />}
                  label={`Client · ${project.client}`}
                />
              </div>

              <p className="mt-8 text-lg md:text-xl text-muted leading-relaxed">
                {project.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {hasLink && (
                  <MagneticButton href={project.link!} variant="primary" size="lg" withArrow>
                    Visit Website
                  </MagneticButton>
                )}
                {hasClientSite && !hasLink && (
                  <MagneticButton href={project.clientWebsite!} variant="primary" size="lg" withArrow>
                    Client Website
                  </MagneticButton>
                )}
                <MagneticButton
                  href="/contact"
                  variant={hasLink || hasClientSite ? "outline" : "primary"}
                  size="lg"
                >
                  Book a Similar Project
                </MagneticButton>
              </div>
            </div>
          </Reveal>

          {/* ===== Preview Mockup ===== */}
          <Reveal delay={0.1} className="mt-14">
            <div className="rounded-2xl md:rounded-[1.75rem] border border-neutral-border bg-surface-raised overflow-hidden shadow-card-lg">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-border bg-brand-bg-hi/60">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/80" />
                </div>
                <div className="mx-auto flex-1 max-w-md">
                  <div className="h-5 rounded-full bg-background/60 border border-neutral-border flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {project.link || `https://glovaxtechnologies.com/work/${project.slug || project.id}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[16/8] md:aspect-[21/9]">
                {hasScreenshot ? (
                  <Image
                    src={project.image!}
                    alt={project.imageAlt || `${project.title} showcase mockup`}
                    title={project.imageTitle || undefined}
                    fill
                    sizes="(max-width: 1280px) 100vw, 1152px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--teal) 14%, var(--brand-bg-hi)) 0%, var(--brand-bg-hi) 55%, color-mix(in srgb, var(--azure) 12%, var(--brand-bg-hi)) 100%)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              </div>
              {project.imageCaption && (
                <div className="p-3 text-center text-xs text-muted border-t border-neutral-border bg-surface">
                  {project.imageCaption}
                </div>
              )}
            </div>
          </Reveal>

          {/* ===== Challenge & Solution ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16 lg:mt-20">
            <Reveal>
              <div className="h-full rounded-3xl border border-neutral-border bg-surface-raised p-8 md:p-10 hover:border-teal/25 hover:shadow-card transition-all duration-500">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warning/10 border border-warning/30 text-warning shadow-glow">
                  <Target className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">The challenge</h2>
                <p className="text-muted leading-relaxed">
                  {project.challenge ?? project.description}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl border border-neutral-border bg-surface-raised p-8 md:p-10 hover:border-teal/25 hover:shadow-card transition-all duration-500">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal/10 border border-teal/25 text-accent shadow-glow">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">Our solution</h2>
                <p className="text-muted leading-relaxed">
                  {project.solution ?? project.description}
                </p>
              </div>
            </Reveal>
          </div>

          {/* ===== Key Features ===== */}
          {keyFeatures.length > 0 && (
            <Reveal className="mt-16 lg:mt-20">
              <div className="mb-8">
                <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                  Key Capabilities
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Core Features & Architecture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-neutral-border bg-surface-raised p-5 hover:border-teal/25 transition-colors"
                  >
                    <span className="mt-1 w-5 h-5 rounded-full bg-teal/10 border border-teal/25 flex items-center justify-center text-accent shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </span>
                    <p className="text-sm md:text-base text-muted leading-relaxed">{feat}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ===== Process Steps ===== */}
          {steps.length > 0 && (
            <Reveal className="mt-16 lg:mt-20">
              <div className="mb-10">
                <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                  Development process
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How we shipped it</h2>
              </div>
              <div className="relative max-w-3xl">
                <div aria-hidden className="absolute left-6 top-0 bottom-0 w-px bg-neutral-border/60" />
                <div className="space-y-6">
                  {steps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="relative flex items-start gap-5"
                    >
                      <span className="relative z-10 mt-1 w-12 h-12 rounded-full bg-surface-raised border border-teal/25 flex items-center justify-center text-sm font-bold text-accent shadow-glow shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-3 text-muted leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* ===== Tech Stack & Services ===== */}
          <Reveal className="mt-16 lg:mt-20">
            <div className="mb-8">
              <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                Technology & Services
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Stack & Capabilities</h2>
            </div>
            <div className="space-y-4">
              {project.services && project.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.services.map((srv) => (
                    <span
                      key={srv}
                      className="px-3.5 py-1.5 rounded-full bg-[#1EDAC6]/10 border border-[#1EDAC6]/25 text-xs font-semibold text-[#1EDAC6]"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2.5">
                {(project.technologies || []).map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full bg-surface-raised border border-neutral-border text-sm font-medium text-muted hover:text-accent hover:border-teal/40 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ===== Key Results ===== */}
          {results.length > 0 && (
            <Reveal className="mt-16 lg:mt-20">
              <div className="mb-8">
                <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                  Outcomes & Metrics
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Measurable Impact Delivered</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, i) => (
                  <motion.div
                    key={result}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="flex items-start gap-3.5 rounded-2xl border border-neutral-border bg-surface-raised p-5 hover:border-teal/25 transition-colors duration-300"
                  >
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-teal/10 border border-teal/25 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-accent" />
                    </span>
                    <p className="text-sm md:text-base text-muted leading-relaxed">{result}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ===== Visual Gallery / Screenshots ===== */}
          {gallery.length > 0 && (
            <Reveal className="mt-16 lg:mt-20">
              <div className="mb-8">
                <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                  Interface Gallery
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Screenshots & Walkthrough</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-neutral-border bg-surface-raised overflow-hidden shadow-card"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={img.url.startsWith("/") || img.url.startsWith("http") ? img.url : `/${img.url}`}
                        alt={img.alt || `${project.title} gallery screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {img.alt && (
                      <div className="p-3 text-xs text-muted bg-surface border-t border-neutral-border">
                        {img.alt}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* ===== Testimonial Section ===== */}
          {testimonial && testimonial.quote && (
            <Reveal className="mt-16 lg:mt-20">
              <div className="relative rounded-3xl border border-teal/20 bg-surface-raised p-8 md:p-12 overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60 pointer-events-none"
                  style={{
                    background: "radial-gradient(500px circle at 15% 20%, var(--teal-glow), transparent 60%)",
                  }}
                />
                <Quote className="relative z-10 w-10 h-10 text-accent/20 mb-6" />
                <blockquote className="relative z-10 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
                <div className="relative z-10 mt-6 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role ? `${testimonial.role}, ` : ""}
                      {testimonial.company}
                    </p>
                  </div>
                  {testimonial.rating && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {/* ===== Related Projects ===== */}
          {related.length > 0 && (
            <Reveal className="mt-20">
              <div className="mb-10">
                <p className="text-accent text-xs md:text-sm font-semibold tracking-[0.28em] uppercase mb-3">
                  More work
                </p>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related case studies</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/work/${item.slug || item.id}`}
                    className="group rounded-3xl border border-neutral-border bg-surface-raised overflow-hidden hover:border-teal/25 hover:shadow-card transition-all duration-500"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.image || "/images/placeholder.svg"}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-medium glass rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.client}</p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {/* ===== CTA Banner ===== */}
          <Reveal className="mt-20">
            <div className="relative rounded-[2rem] border border-neutral-border overflow-hidden p-10 md:p-16 text-center">
              <div className="absolute inset-0 gradient-brand opacity-25 pointer-events-none" />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(600px circle at 50% 50%, var(--teal-glow), transparent 65%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                  Have a project like <span className="teal-shimmer">this one?</span>
                </h2>
                <p className="mt-4 text-muted max-w-xl mx-auto">
                  Tell us about your product goals — we&apos;ll architect a solution on a free 30-minute consultation call.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <MagneticButton href="/contact" variant="primary" size="lg" withArrow>
                    Book a Free Call
                  </MagneticButton>
                  <MagneticButton href="/work" variant="outline" size="lg">
                    See All Projects
                    <ExternalLink className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
