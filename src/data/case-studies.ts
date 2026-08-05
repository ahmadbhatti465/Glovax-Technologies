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
      "Khan Herbals needed a trustworthy online storefront for natural and herbal products — a space where first-time buyers must feel confident before they buy. The existing presence couldn't compete with established retailers or convert cold traffic.",
    solution:
      "We designed and built a complete e-commerce platform around trust: a clean, browsable product catalog, secure checkout, and a mobile-first experience. Information architecture and product pages were structured around clarity and confidence so shoppers feel safe buying on first visit.",
    process: [
      "Discovery & requirements",
      "Information architecture & UX",
      "Storefront design",
      "Development & integrations",
      "Checkout & payments",
      "Launch & handover",
    ],
  },
  "pureststem-ecommerce": {
    industry: "E-commerce · Skincare & Beauty",
    timeline: "5 weeks",
    challenge:
      "PurestStem — a natural herbal skincare brand rooted in 60 years of mountain herbalism heritage — needed a storefront that reflected its story and converted visitors into first-time buyers, not just a product grid.",
    solution:
      "A brand-led, conversion-focused e-commerce build: a curated plant-based catalog with clear CTAs, customer testimonials woven into the shopping flow for social proof, and a blog section to fuel content marketing and SEO — all fully responsive.",
    process: [
      "Brand & positioning review",
      "Design system & art direction",
      "Storefront build",
      "Content & SEO structure",
      "Testimonials & trust layer",
      "Launch & analytics",
    ],
  },
  "musa-travel-service": {
    industry: "Travel · Hajj & Umrah",
    timeline: "8 weeks",
    challenge:
      "Musa Travel Service — a Ministry of Hajj approved operator — needed a booking platform that served two very different audiences at once: individual pilgrims and 120+ partner travel agents, with transparent pricing across multiple airlines.",
    solution:
      "A comprehensive Hajj & Umrah platform with a dedicated B2B Agent Portal for bookings and commission tracking, curated package listings with all-inclusive pricing, multi-airline partnerships (PIA, Saudia, Airblue, SereneAir), a trust-driven UI around 18,000+ pilgrims served, and multi-channel contact systems for lead generation.",
    process: [
      "Stakeholder & agent workshops",
      "Dual-audience UX (pilgrims + agents)",
      "Booking flow & payments",
      "Agent portal development",
      "Airline & content integration",
      "Testing, launch & training",
    ],
  },
  "multi-agent-ai-research-system": {
    industry: "AI / R&D Engineering",
    timeline: "4 weeks",
    challenge:
      "Manual research workflows are slow and shallow — searching, reading sources, drafting, and fact-checking can take days per topic. The goal was to automate the entire pipeline into one autonomous system.",
    solution:
      "A LangChain multi-agent research system: a team of agents that web-search, deep-read pages, draft reports, and critique their own output before it's final. Results are surfaced in a Streamlit UI with tabbed views for the report, critic feedback, search results, and raw content — every claim sourced.",
    process: [
      "Agent architecture design",
      "Search & retrieval pipeline",
      "Report drafting & self-critique loop",
      "Source citation & validation",
      "UI for transparency",
      "Testing on live topics",
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
