"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { motion } from "framer-motion";
import { Target, Shield, Zap, Users, Globe, Heart } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
};

const fallbackValues = [
  {
    icon: "Target",
    title: "Results First",
    description: "We measure success by the tangible business outcomes we deliver, not just lines of code shipped.",
  },
  {
    icon: "Shield",
    title: "Quality Obsessed",
    description: "Every pixel, every interaction, every line of code is crafted with precision and pride.",
  },
  {
    icon: "Zap",
    title: "Move Fast",
    description: "We combine agility with rigor to ship faster without sacrificing quality or security.",
  },
  {
    icon: "Users",
    title: "True Partners",
    description: "We're not vendors — we're an extension of your team, invested in your long-term success.",
  },
  {
    icon: "Globe",
    title: "Global Mindset",
    description: "We build products that work everywhere, for everyone, respecting diverse users and markets.",
  },
  {
    icon: "Heart",
    title: "Craft with Care",
    description: "We love what we do, and it shows in the attention and thoughtfulness we bring to every project.",
  },
];

const fallbackTimeline = [
  { year: "2018", event: "Founded in Lahore, Pakistan" },
  { year: "2019", event: "First 25 clients across Pakistan" },
  { year: "2020", event: "Expanded to mobile development" },
  { year: "2021", event: "AI & ML practice launched" },
  { year: "2022", event: "100+ projects delivered" },
  { year: "2023", event: "Global expansion: 30+ countries" },
  { year: "2024", event: "35+ team members worldwide" },
  { year: "2025", event: "Recognized software house in APAC" },
];

interface AboutContentProps {
  about?: {
    heroEyebrow: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    stats: { value: number; suffix: string; label: string }[];
    values: { icon: string; title: string; description: string }[];
    timeline: { year: string; event: string }[];
  } | null;
  lastUpdated?: Date | null;
}

export default function AboutContent({ about, lastUpdated }: AboutContentProps) {
  if (!about) {
    return (
      <AboutContentInner
        values={fallbackValues}
        timeline={fallbackTimeline}
        lastUpdated={lastUpdated}
      />
    );
  }

  return (
    <AboutContentInner
      heroEyebrow={about.heroEyebrow}
      heroTitle={about.heroTitle}
      heroTitleHighlight={about.heroTitleHighlight}
      heroSubtitle={about.heroSubtitle}
      stats={about.stats}
      values={about.values ?? fallbackValues}
      timeline={about.timeline ?? fallbackTimeline}
      lastUpdated={lastUpdated}
    />
  );
}

interface AboutContentInnerProps {
  heroEyebrow?: string;
  heroTitle?: string;
  heroTitleHighlight?: string;
  heroSubtitle?: string;
  stats?: { value: number; suffix: string; label: string }[];
  values: { icon: string; title: string; description: string }[];
  timeline: { year: string; event: string }[];
  lastUpdated?: Date | null;
}

function AboutContentInner({
  heroEyebrow = "About Us",
  heroTitle = "Building the future,",
  heroTitleHighlight = "one product at a time.",
  heroSubtitle = "Glovax Technologies is a Lahore-based software house and digital agency that helps businesses worldwide leverage AI, cloud, and modern web technologies to create meaningful impact.",
  stats = [
    { value: 100, suffix: "+", label: "Projects" },
    { value: 99, suffix: "%", label: "Satisfaction" },
    { value: 30, suffix: "+", label: "Countries" },
    { value: 35, suffix: "+", label: "Team" },
  ],
  values,
  timeline,
  lastUpdated,
}: AboutContentInnerProps) {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mb-20"
          >
            <span className="text-accent text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
              {heroEyebrow}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              {heroTitle}
              <span className="gradient-text"> {heroTitleHighlight}</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              {heroSubtitle}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-4">
                Last updated:{" "}
                {new Date(lastUpdated).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-y border-border mb-20">
            {(stats ?? []).map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <SectionHeader
            eyebrow="Our Values"
            title="What we"
            titleHighlight="believe"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="p-6 rounded-2xl bg-surface border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {iconMap[value.icon] || <Target className="w-5 h-5" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Founder & Technical Leadership Section (E-E-A-T & Authority) */}
          <section aria-labelledby="founder-leadership" className="mb-24">
            <SectionHeader
              eyebrow="Engineering Leadership"
              title="Built by engineers, led by"
              titleHighlight="craftsmanship"
              subtitle="Direct access to senior full-stack & AI architecture with zero junior handoffs."
              align="left"
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-8 md:p-10 rounded-3xl bg-surface border border-border hover:border-accent/40 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-accent/10 border-2 border-accent/40 flex items-center justify-center text-accent font-bold text-2xl md:text-3xl flex-shrink-0 shadow-lg">
                  MA
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                    Founder & Lead Systems Architect
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mt-1 text-foreground">
                    Muhammad Ahmad
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full Stack Developer & AI/ML Engineer · Lahore, Pakistan (Serving UK & US Clients)
                  </p>
                  <p className="text-sm md:text-base text-muted mt-4 leading-relaxed">
                    Muhammad Ahmad is the founder of Glovax Technologies, specializing in production-grade Next.js web applications, high-throughput FastAPI backends, and custom Retrieval-Augmented Generation (RAG) architectures. With extensive experience delivering scalable software platforms for international startups across the US, UK, and Middle East, Ahmad bridges the gap between deep AI/ML capabilities and modern cloud development.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-sm">
                    <a
                      href="https://linkedin.com/in/ahmadbhatti465"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline"
                    >
                      LinkedIn Profile &rarr;
                    </a>
                    <span className="text-border">·</span>
                    <a
                      href="https://github.com/ahmadbhatti465"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline"
                    >
                      GitHub Projects &rarr;
                    </a>
                    <span className="text-border">·</span>
                    <a
                      href="https://www.upwork.com/freelancers/ahmadbhatti465"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent font-medium hover:underline"
                    >
                      Upwork Top Rated &rarr;
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Timeline */}
          <SectionHeader
            eyebrow="Our Journey"
            title="How we got"
            titleHighlight="here"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative p-5 rounded-xl bg-surface border border-border"
              >
                <span className="text-accent text-sm font-semibold">
                  {item.year}
                </span>
                <p className="mt-1 text-sm text-foreground">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
