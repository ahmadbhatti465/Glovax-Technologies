import { PortfolioItem } from "@/types";

export const portfolioItems: PortfolioItem[] = [
  {
    id: "luxewear-global",
    title: "LuxeWear Global Store",
    client: "LuxeWear Fashion Group",
    category: "E-Commerce",
    description:
      "A headless e-commerce platform powering a global fashion retailer across 12 markets. Built with Next.js and Shopify Plus, featuring AI-powered recommendations, real-time inventory sync, and a seamless mobile-first checkout experience.",
    results: [
      "$4.2M revenue in first quarter post-launch",
      "38% increase in mobile conversion rate",
      "Sub-second page load times globally",
    ],
    technologies: ["Next.js", "Shopify Plus", "Stripe", "Algolia", "Vercel"],
    image: "/images/portfolio/luxewear.jpg",
    featured: true,
  },
  {
    id: "flowstate-analytics",
    title: "FlowState Analytics Dashboard",
    client: "FlowState Technologies",
    category: "Web Development",
    description:
      "A real-time SaaS analytics dashboard for enterprise teams, featuring live data pipelines, custom report builders, and collaborative workspaces. Handles millions of events daily with sub-second query performance.",
    results: [
      "Processing 5M+ events daily with 99.99% uptime",
      "60% reduction in reporting time for clients",
      " onboarding time cut from 3 weeks to 2 days",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
    image: "/images/portfolio/flowstate.jpg",
    featured: true,
  },
  {
    id: "fitpulse-fitness",
    title: "FitPulse Fitness App",
    client: "FitPulse Health",
    category: "Mobile Apps",
    description:
      "Cross-platform fitness application with wearable integration, personalized workout plans, and social challenges. Features offline mode, real-time activity sync, and advanced health data visualization.",
    results: [
      "4.8 App Store rating with 1M+ downloads",
      "72% monthly active user retention",
      "Integration with 25+ wearable devices",
    ],
    technologies: ["React Native", "GraphQL", "Node.js", "MongoDB", "Firebase"],
    image: "/images/portfolio/fitpulse.jpg",
    featured: true,
  },
  {
    id: "nexgen-ai-engine",
    title: "NexGen AI Content Engine",
    client: "NexGen Marketing",
    category: "AI Solutions",
    description:
      "An AI-powered content generation and optimization platform that automates marketing workflows, predicts content performance, and personalizes messaging at scale across multiple channels.",
    results: [
      "350% improvement in content production speed",
      "85% accuracy in performance prediction",
      "2.5x increase in campaign ROI",
    ],
    technologies: ["Python", "TensorFlow", "FastAPI", "React", "GCP"],
    image: "/images/portfolio/nexgen.jpg",
    featured: false,
  },
  {
    id: "finserve-cloud",
    title: "FinServe Cloud Transformation",
    client: "FinServe Banking Corp",
    category: "Cloud & DevOps",
    description:
      "Complete legacy infrastructure migration to AWS for a tier-1 banking institution, implementing zero-downtime deployment strategies, automated disaster recovery, and strict compliance automation.",
    results: [
      "50% reduction in infrastructure costs",
      "Zero-downtime migration of 200+ services",
      "SOC 2 Type II and PCI DSS compliance achieved",
    ],
    technologies: ["AWS", "Terraform", "Docker", "Kubernetes", "GitHub Actions"],
    image: "/images/portfolio/finserve.jpg",
    featured: false,
  },
  {
    id: "vertex-robotics",
    title: "Vertex Robotics Rebrand",
    client: "Vertex Robotics",
    category: "UI/UX Design",
    description:
      "Complete brand identity overhaul and website redesign for an industrial robotics startup. Focused on conveying precision and innovation through motion design, 3D visuals, and an immersive product showcase.",
    results: [
      "180% increase in demo requests",
      "WCAG 2.1 AAA compliance achieved",
      "42% lower bounce rate post-launch",
    ],
    technologies: ["Figma", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"],
    image: "/images/portfolio/vertex.jpg",
    featured: false,
  },
];
