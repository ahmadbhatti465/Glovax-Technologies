import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./src/db/schema";

const url = process.env.DATABASE_URL || "file:./sqlite.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

const client = createClient({
  url,
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  // WARNING: this deletes and re-inserts the tables below. Never run against
  // production (Turso) if you've added real content via the admin panel —
  // it will overwrite it. For prod, update records via /admin instead.
  await db.delete(schema.portfolioItems);
  await db.delete(schema.testimonials);
  await db.delete(schema.services);
  await db.delete(schema.blogPosts);

  await db.insert(schema.services).values([
    {
      id: "web-development",
      title: "Web Development",
      description: "Sites and SaaS that load fast, rank well, and turn visitors into paying customers.",
      features: ["Lightning-fast Next.js & React builds", "Conversion-focused design", "SEO-ready architecture", "Headless CMS your team can edit", "E-commerce & payments"],
      icon: "Code2",
    },
    {
      id: "mobile-apps",
      title: "Mobile Apps",
      description: "Native-quality iOS & Android apps your users actually keep coming back to.",
      features: ["Cross-platform iOS & Android", "Intuitive UX that drives retention", "Push notifications & real-time features", "App Store readiness", "Ongoing maintenance & updates"],
      icon: "Smartphone",
    },
    {
      id: "ai-solutions",
      title: "AI & Machine Learning",
      description: "AI that automates the busywork and puts your data to work — LLM apps, RAG systems, and custom models.",
      features: ["AI chatbots & assistants", "RAG on your own documents", "LLM integrations (OpenAI, Mistral)", "Predictive analytics", "MLOps & deployment"],
      icon: "Brain",
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps",
      description: "Infrastructure that scales with you and never keeps you up at night.",
      features: ["AWS architecture done right", "CI/CD pipelines", "Docker & Kubernetes", "Infrastructure as code", "Cost & security optimization"],
      icon: "Cloud",
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "Marketing that turns your product into predictable, measurable growth.",
      features: ["SEO that brings qualified traffic", "PPC & paid campaigns", "Content strategy", "Conversion rate optimization", "Reporting you can act on"],
      icon: "TrendingUp",
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      description: "Interfaces users actually enjoy — so they stay longer and convert more.",
      features: ["User research & testing", "Wireframes & prototypes", "Design systems", "Interaction design", "Accessibility (WCAG)"],
      icon: "Palette",
    },
  ]);

  // Real client projects — mirrors the production Turso data so reseeding is safe.
  // (Injaaz is scaffolded; fill it in via the admin panel when details are ready.)
  await db.insert(schema.portfolioItems).values([
    {
      id: "01",
      title: "Khan Herbals",
      client: "Mohyudin",
      category: "E-commerce Website",
      description:
        "Designed and developed a complete e-commerce website for Khan Herbals, built to showcase and sell natural and herbal products online. The platform features a clean product catalog, secure checkout, and a mobile-friendly shopping experience that makes the buying journey easy and trustworthy for customers.",
      link: "https://khanherbals.com/",
      results: [
        "Fully functional online store launched",
        "Mobile-responsive design across all devices",
        "Improved product discoverability and browsing experience",
        "Secure and streamlined checkout process",
      ],
      technologies: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
      image: "/images/portfolio/khanherbals.webp",
      featured: true,
    },
    {
      id: "pureststem-ecommerce",
      title: "PurestStem — Natural Herbal Skincare",
      client: "PurestStem",
      category: "E-commerce / Web Design",
      description:
        "Designed and developed a full e-commerce website for PurestStem, a natural herbal skincare brand rooted in 60 years of mountain herbalism heritage. The platform showcases a curated line of plant-based skincare products with a conversion-focused, brand-led shopping experience.",
      link: "https://purest-stem.vercel.app/",
      results: [
        "Clean, conversion-focused product catalog with clear CTAs",
        "Integrated customer testimonials to build trust and social proof",
        "Blog section added for content marketing and SEO growth",
        "Mobile-responsive design across all devices",
        "Cohesive green/botanical branding aligned with product identity",
      ],
      technologies: ["React", "Next.js", "Tailwind CSS", "Node.js", "MongoDB", "Stripe"],
      image: "",
      featured: true,
    },
    {
      id: "musa-travel-service",
      title: "Musa Travel Service — Hajj & Umrah Booking",
      client: "Musa Travel Service",
      category: "Travel & Booking Platform",
      description:
        "Developed a comprehensive Hajj & Umrah travel booking platform for Musa Travel Service, a Ministry of Hajj approved operator based in Lahore, Pakistan. The platform serves both individual pilgrims and 120+ partner travel agents.",
      link: "https://travelwithmusa.com/",
      results: [
        "Launched dedicated Agent Portal for B2B travel agent bookings and commission tracking",
        "Curated 6+ Umrah package listings with transparent, all-inclusive pricing",
        "Integrated multi-airline partnerships (PIA, Saudia, Airblue, SereneAir) into booking flow",
        "Built trust-driven UI highlighting 18,000+ pilgrims served and 120+ partner agents",
        "Added interactive location map and multi-channel contact system for lead generation",
        "Fully responsive design optimized for both pilgrims and agency partners",
      ],
      technologies: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB", "Express"],
      image: "",
      featured: true,
    },
    {
      id: "multi-agent-ai-research-system",
      title: "Multi-Agent AI Research System",
      client: "Personal / Internal Project",
      category: "AI/ML Engineering / LangChain",
      description:
        "Built an autonomous multi-agent AI research system that automates the entire research workflow — from web searching and in-depth page reading to draft report generation and self-critique. Given any topic, the system deploys a team of agents that research, write, critique, and refine a fully sourced report.",
      link: "",
      results: [
        "Automated end-to-end research pipeline reducing manual research time significantly",
        "Self-critique loop improves report accuracy through agent-based review before final output",
        "Structured, source-cited reports with 5+ reputable references pulled automatically per topic",
        "Full transparency with tabbed views for report, critic feedback, search results, and raw content",
        "Successfully tested on medical/health research topics with accurate, well-sourced output",
      ],
      technologies: ["Python", "LangChain", "Streamlit", "OpenAI / Mistral API", "Multi-Agent Architecture", "Web Scraping (BeautifulSoup/Requests)"],
      image: "",
      featured: false,
    },
    {
      id: "injaaz",
      title: "Injaaz",
      client: "Injaaz",
      category: "Web Development",
      description: "[Add project description via the admin panel]",
      link: "",
      results: ["[Add real result metric]"],
      technologies: [],
      image: "",
      featured: false,
    },
  ]);

  // PLACEHOLDER TESTIMONIALS — replace each with a real, attributed UK/US client
  // quote (or a genuine Upwork review) before launch. Never ship fabricated praise.
  await db.insert(schema.testimonials).values([
    { id: "1", content: "[REPLACE WITH REAL QUOTE] Add a genuine client review here.", author: "[Client name]", role: "[Role]", company: "[Company]", rating: 5 },
    { id: "2", content: "[REPLACE WITH REAL QUOTE] Add a genuine client review here.", author: "[Client name]", role: "[Role]", company: "[Company]", rating: 5 },
    { id: "3", content: "[REPLACE WITH REAL QUOTE] Add a genuine client review here.", author: "[Client name]", role: "[Role]", company: "[Company]", rating: 5 },
  ]);

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
