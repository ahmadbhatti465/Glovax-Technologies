import { Service } from "@/types";

// Fallback copy shown when the CMS has no services. Benefit-led, outcome-first.
export const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Sites and SaaS that load fast, rank well, and turn visitors into paying customers.",
    features: [
      "Lightning-fast Next.js & React builds",
      "Conversion-focused design",
      "SEO-ready architecture",
      "Headless CMS your team can edit",
      "E-commerce & payments",
    ],
    icon: "Code2",
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    description:
      "Native-quality iOS & Android apps your users actually keep coming back to.",
    features: [
      "Cross-platform iOS & Android",
      "Intuitive UX that drives retention",
      "Push notifications & real-time features",
      "App Store readiness",
      "Ongoing maintenance & updates",
    ],
    icon: "Smartphone",
  },
  {
    id: "ai-solutions",
    title: "AI & Machine Learning",
    description:
      "AI that automates the busywork and puts your data to work — LLM apps, RAG systems, and custom models.",
    features: [
      "AI chatbots & assistants",
      "RAG on your own documents",
      "LLM integrations (OpenAI, Mistral)",
      "Predictive analytics",
      "MLOps & deployment",
    ],
    icon: "Brain",
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    description:
      "Infrastructure that scales with you and never keeps you up at night.",
    features: [
      "AWS architecture done right",
      "CI/CD pipelines",
      "Docker & Kubernetes",
      "Infrastructure as code",
      "Cost & security optimization",
    ],
    icon: "Cloud",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description:
      "Marketing that turns your product into predictable, measurable growth.",
    features: [
      "SEO that brings qualified traffic",
      "PPC & paid campaigns",
      "Content strategy",
      "Conversion rate optimization",
      "Reporting you can act on",
    ],
    icon: "TrendingUp",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "Interfaces users actually enjoy — so they stay longer and convert more.",
    features: [
      "User research & testing",
      "Wireframes & prototypes",
      "Design systems",
      "Interaction design",
      "Accessibility (WCAG)",
    ],
    icon: "Palette",
  },
];
