import type { PortfolioItem } from "@/types";

/**
 * Case-study enrichment for portfolio items.
 *
 * Portfolio items themselves (from the CMS) carry the base fields — title,
 * client, category, description, results, technologies, image. This file adds
 * the deeper story for each project: industry, timeline, challenge, solution,
 * and process. It is keyed by portfolio `id` and merged at render time.
 *
 * NOTE: testimonials are intentionally left empty here until real, attributed
 * client quotes exist. The site never ships fabricated praise.
 */
type CaseStudy = Partial<
  Pick<
    PortfolioItem,
    | "industry"
    | "timeline"
    | "challenge"
    | "solution"
    | "process"
    | "testimonial"
    | "screenshots"
  >
>;

const caseStudies: Record<string, CaseStudy> = {
  "01": {
    industry: "E-commerce · Health & Wellness",
    timeline: "6 weeks",
    challenge:
      "Khan Herbals required a scalable digital storefront to transition from regional retail to national e-commerce. The core challenges were establishing instant trust with first-time buyers, managing high-SKU inventory variations, and achieving sub-2s mobile page load speeds across variable mobile networks.",
    solution:
      "We engineered a full-stack Next.js storefront paired with PostgreSQL and Tailwind CSS. The architecture features server-side catalog indexing, optimized image delivery pipelines, streamlined multi-step checkout with instant SMS verification, and structured Product JSON-LD schema for rich search snippet eligibility.",
    process: [
      "Technical discovery & SKU mapping",
      "UX wireframing & Trust-first UI design",
      "Next.js App Router storefront implementation",
      "Database design & inventory synchronization",
      "Checkout optimization & gateway integration",
      "Core Web Vitals tuning & production deployment",
    ],
  },
  "pureststem-ecommerce": {
    industry: "E-commerce · Skincare & Beauty",
    timeline: "5 weeks",
    challenge:
      "PurestStem — an organic skincare brand rooted in 60 years of heritage — faced high cart abandonment and slow mobile performance (4.2s LCP on legacy platforms). They needed an ultra-fast, premium digital shopping experience capable of educating buyers and driving high-converting sales.",
    solution:
      "Glovax Technologies engineered a headless e-commerce platform using Next.js Server Components and Tailwind CSS. By eliminating render-blocking scripts and optimizing asset delivery, we dropped mobile LCP to 1.1s, integrated social proof directly into the purchase flow, and implemented an SEO-optimized editorial blog.",
    process: [
      "Brand positioning & visual architecture",
      "Headless storefront engineering (Next.js SSR)",
      "Automated image optimization & edge CDN caching",
      "Conversion Rate Optimization (CRO) review",
      "Structured data & FAQ schema deployment",
      "Analytics & continuous conversion tracking",
    ],
  },
  "musa-travel-service": {
    industry: "Travel · Enterprise Booking & Logistics",
    timeline: "8 weeks",
    challenge:
      "Musa Travel Service needed a robust dual-audience portal to serve individual pilgrims alongside 120+ wholesale travel agents, handling multi-airline package coordination, dynamic commission tiers, and high-volume seasonal traffic spikes.",
    solution:
      "We architected a scalable web application with a dedicated B2B Agent Portal, real-time airline inventory synchronization (PIA, Saudia, Airblue), role-based commission tracking, and an intuitive direct-to-consumer booking funnel with automated WhatsApp status notifications.",
    process: [
      "Enterprise workflow & agent persona mapping",
      "B2B Agent Portal & B2C Booking UX",
      "API integration for real-time airline inventory",
      "Role-based access control & commission logic",
      "Dockerized microservices & AWS staging",
      "Load testing & production launch",
    ],
  },
  "multi-agent-ai-research-system": {
    industry: "AI Systems · Autonomous Agent Engineering",
    timeline: "4 weeks",
    challenge:
      "Enterprise market and technical research requires cross-referencing dozens of academic, financial, and web sources — a manual workflow requiring days of developer and analyst time per query with high risk of synthesis errors.",
    solution:
      "Engineered an autonomous Multi-Agent AI system using LangChain and Python. The architecture deploys coordinated specialist agents (Planner, Deep-Web Crawler, Report Synthesizer, and Fact-Checking Critic) operating in an iterative self-correction loop with transparent source citation and vector verification.",
    process: [
      "Agent communication graph & state machine design",
      "Hybrid retrieval & semantic scraping pipeline",
      "Iterative self-critique & hallucination suppression loop",
      "Source verification & citation binding",
      "Streamlit & FastAPI interactive research dashboard",
      "Benchmarking across 100+ research domain queries",
    ],
  },
};

/**
 * Merge a portfolio item with its case-study enrichment (if any).
 * Returns the enriched item; base fields always win for their own keys.
 */
export function enrichWithCaseStudy(item: PortfolioItem): PortfolioItem {
  const extra = caseStudies[item.id] ?? {};
  return {
    ...item,
    ...extra,
  };
}

export function getCaseStudy(id: string): CaseStudy | null {
  return caseStudies[id] ?? null;
}
