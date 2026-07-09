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

  await db.delete(schema.portfolioItems);
  await db.delete(schema.testimonials);
  await db.delete(schema.services);
  await db.delete(schema.blogPosts);

  await db.insert(schema.services).values([
    {
      id: "web-development",
      title: "Web Development",
      description: "We build blazing-fast, scalable web applications using Next.js, React, and modern architectures. From marketing sites to complex SaaS platforms.",
      features: ["Next.js & React Applications", "Headless CMS Integration", "E-commerce Solutions", "Performance Optimization", "API Development"],
      icon: "Code2",
    },
    {
      id: "mobile-apps",
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android using React Native and Flutter.",
      features: ["iOS & Android Development", "React Native & Flutter", "UI/UX Design", "App Store Optimization", "Maintenance & Support"],
      icon: "Smartphone",
    },
    {
      id: "ai-solutions",
      title: "AI & Machine Learning",
      description: "Custom AI solutions that automate processes, extract insights from data, and give your business a competitive edge with intelligent systems.",
      features: ["Generative AI Integration", "Predictive Analytics", "Natural Language Processing", "Computer Vision", "MLOps & Deployment"],
      icon: "Brain",
    },
    {
      id: "cloud-devops",
      title: "Cloud & DevOps",
      description: "Enterprise-grade cloud infrastructure and DevOps automation on AWS, GCP, and Azure. We design scalable, secure, and cost-efficient systems.",
      features: ["Cloud Architecture Design", "CI/CD Pipeline Setup", "Kubernetes & Containers", "Infrastructure as Code", "24/7 Monitoring"],
      icon: "Cloud",
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing",
      description: "Data-driven marketing strategies that increase visibility, generate leads, and maximize ROI through SEO, SEM, and targeted campaigns.",
      features: ["SEO & Content Strategy", "PPC & Paid Advertising", "Social Media Management", "Conversion Optimization", "Analytics & Reporting"],
      icon: "TrendingUp",
    },
    {
      id: "ui-ux-design",
      title: "UI/UX Design",
      description: "Human-centered design that transforms complex problems into intuitive, beautiful digital experiences users love.",
      features: ["User Research & Testing", "Wireframing & Prototyping", "Design Systems", "Interaction Design", "Accessibility Compliance"],
      icon: "Palette",
    },
  ]);

  await db.insert(schema.portfolioItems).values([
    {
      id: "luxewear-global",
      title: "LuxeWear Global Store",
      client: "LuxeWear Fashion Group",
      category: "E-Commerce",
      description: "A headless e-commerce platform powering a global fashion retailer across 12 markets.",
      link: "https://vercel.com/templates",
      results: ["$4.2M revenue in first quarter post-launch", "38% increase in mobile conversion rate", "Sub-second page load times globally"],
      technologies: ["Next.js", "Shopify Plus", "Stripe", "Algolia", "Vercel"],
      image: "/images/portfolio/luxewear.jpg",
      featured: true,
    },
    {
      id: "flowstate-analytics",
      title: "FlowState Analytics Dashboard",
      client: "FlowState Technologies",
      category: "Web Development",
      description: "A real-time SaaS analytics dashboard for enterprise teams.",
      link: "https://vercel.com/templates",
      results: ["Processing 5M+ events daily with 99.99% uptime", "60% reduction in reporting time", "Onboarding time cut from 3 weeks to 2 days"],
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
      image: "/images/portfolio/flowstate.jpg",
      featured: true,
    },
    {
      id: "fitpulse-fitness",
      title: "FitPulse Fitness App",
      client: "FitPulse Health",
      category: "Mobile Apps",
      description: "Cross-platform fitness application with wearable integration.",
      link: "https://vercel.com/templates",
      results: ["4.8 App Store rating with 1M+ downloads", "72% monthly active user retention", "Integration with 25+ wearable devices"],
      technologies: ["React Native", "GraphQL", "Node.js", "MongoDB", "Firebase"],
      image: "/images/portfolio/fitpulse.jpg",
      featured: true,
    },
    {
      id: "nexgen-ai-engine",
      title: "NexGen AI Content Engine",
      client: "NexGen Marketing",
      category: "AI Solutions",
      description: "An AI-powered content generation and optimization platform.",
      link: "https://vercel.com/templates",
      results: ["350% improvement in content production speed", "85% accuracy in performance prediction", "2.5x increase in campaign ROI"],
      technologies: ["Python", "TensorFlow", "FastAPI", "React", "GCP"],
      image: "/images/portfolio/nexgen.jpg",
      featured: false,
    },
    {
      id: "finserve-cloud",
      title: "FinServe Cloud Transformation",
      client: "FinServe Banking Corp",
      category: "Cloud & DevOps",
      description: "Complete legacy infrastructure migration to AWS.",
      link: "https://vercel.com/templates",
      results: ["50% reduction in infrastructure costs", "Zero-downtime migration of 200+ services", "SOC 2 Type II and PCI DSS compliance"],
      technologies: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
      image: "/images/portfolio/finserve.jpg",
      featured: false,
    },
    {
      id: "vertex-robotics",
      title: "Vertex Robotics Rebrand",
      client: "Vertex Robotics",
      category: "UI/UX Design",
      description: "Complete brand identity overhaul and website redesign.",
      link: "https://vercel.com/templates",
      results: ["180% increase in demo requests", "WCAG 2.1 AAA compliance", "42% lower bounce rate"],
      technologies: ["Figma", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
      image: "/images/portfolio/vertex.jpg",
      featured: false,
    },
  ]);

  await db.insert(schema.testimonials).values([
    { id: "1", content: "Glovax Technologies transformed our entire digital presence. Their team delivered a world-class SaaS platform.", author: "Sarah Johnson", role: "CEO", company: "TechStart Inc.", rating: 5 },
    { id: "2", content: "Working with Glovax Technologies was a game-changer for our startup.", author: "Michael Chen", role: "CTO", company: "InnovateLabs", rating: 5 },
    { id: "3", content: "The AI marketing engine delivered a 300% ROI within the first quarter.", author: "Emily Rodriguez", role: "Marketing Director", company: "GrowthCo", rating: 5 },
    { id: "4", content: "We migrated our entire infrastructure to AWS with zero downtime.", author: "David Kim", role: "VP of Engineering", company: "GlobalTech", rating: 5 },
    { id: "5", content: "The rebrand and website redesign exceeded our expectations.", author: "Lisa Thompson", role: "Founder", company: "DigitalFirst", rating: 5 },
  ]);

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
