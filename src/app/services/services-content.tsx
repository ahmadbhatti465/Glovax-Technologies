"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { services as fallbackServices } from "@/data/services";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
  ArrowUpRight,
} from "lucide-react";
import { Service } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

const iconMap: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-8 h-8" />,
  Smartphone: <Smartphone className="w-8 h-8" />,
  Brain: <Brain className="w-8 h-8" />,
  Cloud: <Cloud className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  Palette: <Palette className="w-8 h-8" />,
};

interface FAQItem {
  question: string;
  answer: string;
}

interface ServicesContentProps {
  services?: Service[];
  faqs?: FAQItem[];
  lastUpdated?: Date | null;
}

export default function ServicesContent({
  services: serverServices,
  faqs = [],
  lastUpdated,
}: ServicesContentProps) {
  const services = serverServices?.length ? serverServices : fallbackServices;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="Solutions for every"
            titleHighlight="challenge"
            subtitle="We offer end-to-end digital services designed to accelerate your growth, reduce costs, and future-proof your business."
            align="left"
          />

          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-8 -mt-8">
              Last updated: {" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="space-y-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                      {iconMap[service.icon]}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                          {service.title}
                        </h2>
                        <p className="text-muted leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <MagneticButton
                        href="/contact"
                        variant="ghost"
                        size="sm"
                        className="text-accent hover:text-accent-hover"
                      >
                        Discuss this service
                        <ArrowUpRight className="w-4 h-4" />
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stack Comparison Table Section (GEO & Conversion Optimized) */}
          <section aria-labelledby="architecture-comparison" className="mt-28 mb-20">
            <SectionHeader
              eyebrow="Architecture Breakdown"
              title="Next.js vs Traditional MERN for"
              titleHighlight="Scalable Startups"
              subtitle="Choosing the right architectural foundation is critical for performance, SEO, AI search indexability, and scalability."
              align="left"
            />

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-raised/50">
                    <th className="p-4 md:p-5 font-semibold text-foreground">Comparison Metric</th>
                    <th className="p-4 md:p-5 font-semibold text-accent">Next.js (App Router / SSR)</th>
                    <th className="p-4 md:p-5 font-semibold text-muted-foreground">Traditional MERN (React SPA + Express)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">SEO & AI Search Indexability</td>
                    <td className="p-4 md:p-5 text-accent font-medium">Instant & Native (Pre-rendered HTML for Googlebot & LLM crawlers)</td>
                    <td className="p-4 md:p-5 text-muted">Poor (Requires secondary client JavaScript execution)</td>
                  </tr>
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">Core Web Vitals (LCP)</td>
                    <td className="p-4 md:p-5 text-accent font-medium">Sub-1.5s with Edge SSR and automatic image optimization</td>
                    <td className="p-4 md:p-5 text-muted">2.5s - 4.5s due to initial client JS bundle download & hydration</td>
                  </tr>
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">AI & Streaming Capability</td>
                    <td className="p-4 md:p-5 text-accent font-medium">Native Vercel AI SDK integration, Server Actions & edge streaming</td>
                    <td className="p-4 md:p-5 text-muted">Requires custom WebSocket / SSE middleware in Node.js</td>
                  </tr>
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">Backend Architecture</td>
                    <td className="p-4 md:p-5 text-foreground">Serverless / Edge route handlers or paired with FastAPI Python</td>
                    <td className="p-4 md:p-5 text-muted">Standalone Express.js server (monolithic or containerized)</td>
                  </tr>
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">Best Application Type</td>
                    <td className="p-4 md:p-5 text-accent font-medium">B2B SaaS, AI platforms, E-Commerce, High-traffic web products</td>
                    <td className="p-4 md:p-5 text-muted">Internal business tools and dashboards behind authentication</td>
                  </tr>
                  <tr className="hover:bg-surface-raised/30 transition-colors">
                    <td className="p-4 md:p-5 font-medium text-foreground">Glovax Recommendation</td>
                    <td className="p-4 md:p-5 text-accent font-semibold">Recommended for 90% of modern public platforms</td>
                    <td className="p-4 md:p-5 text-muted">Suitable for legacy migrations and private portals</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* AI Knowledge & GEO Q&A Section */}
          <section aria-labelledby="technical-faqs" className="mt-24">
            <SectionHeader
              eyebrow="Technical Insights & FAQ"
              title="Answers for engineers, founders &"
              titleHighlight="AI engines"
              subtitle="Direct answers to technical architecture questions, engineered for decision-makers and Generative AI overviews."
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
                  className="p-6 md:p-8 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-sm md:text-base text-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
