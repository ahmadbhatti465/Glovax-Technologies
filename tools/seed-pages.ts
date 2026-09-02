import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";

const url = process.env.DATABASE_URL || "file:./sqlite.db";
const isTurso = url.startsWith("libsql://") || url.startsWith("https://");

const client = createClient({
  url,
  ...(isTurso && process.env.DATABASE_AUTH_TOKEN
    ? { authToken: process.env.DATABASE_AUTH_TOKEN }
    : {}),
});

const db = drizzle(client, { schema });

const initialPages = [
  {
    id: "page-web-dev-services",
    title: "Professional Web Development Services",
    slug: "web-development-services",
    excerpt:
      "High-performance custom web development, Next.js web applications, and enterprise SaaS platforms crafted for speed, search visibility, and conversion.",
    content: `
      <h2>Enterprise-Grade Web Development for High-Growth Businesses</h2>
      <p>At <strong>Glovax Technologies</strong>, we engineer web applications that combine modern architectural precision with superior user experience. In today's digital landscape, speed, responsive design, and technical SEO are not optional features—they are fundamental prerequisites for commercial success.</p>
      
      <h2>Why Partner With Glovax Technologies for Web Development?</h2>
      <p>Our engineering team specializes in modern JavaScript frameworks, full-stack TypeScript, and headless cloud architectures designed to scale effortlessly as your user base expands.</p>
      
      <ul>
        <li><strong>Modern Tech Stack:</strong> React 19, Next.js App Router, TypeScript, and Tailwind CSS.</li>
        <li><strong>Sub-Second Loading Speeds:</strong> Optimized Core Web Vitals to maximize search rankings and conversion rates.</li>
        <li><strong>Technical SEO Foundation:</strong> Server-side rendered metadata, Open Graph cards, and JSON-LD structured data out of the box.</li>
        <li><strong>Scalable API Architecture:</strong> Seamless integration with REST, GraphQL, and microservices backends.</li>
      </ul>

      <h2>Our Full-Stack Web Development Capabilities</h2>
      <p>From custom SaaS platforms and client portals to high-converting marketing hubs and e-commerce ecosystems, we deliver end-to-end solutions tailored to your business objectives.</p>

      <div class="overflow-x-auto my-6">
        <table class="w-full text-sm border-collapse border border-[#1EDAC6]/20 rounded-lg">
          <thead>
            <tr class="bg-surface-raised text-[#1EDAC6]">
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Service Area</th>
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Core Technologies</th>
              <th class="border border-[#1EDAC6]/20 p-3 text-left">Key Deliverables</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-300">Custom Web Applications</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Next.js, Node.js, Drizzle ORM, LibSQL</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Scalable dashboards, SaaS workflows, auth systems</td>
            </tr>
            <tr>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-300">E-Commerce Platforms</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Shopify, Headless Commerce, Stripe</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Custom storefronts, high conversion checkouts</td>
            </tr>
            <tr>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-300">Corporate & Marketing Hubs</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">React, Tailwind CSS, Framer Motion</td>
              <td class="border border-[#1EDAC6]/10 p-3 text-gray-400">Interactive branding, technical SEO optimization</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Our Collaborative Development Process</h2>
      <p>We work in agile, transparent sprints, providing continuous staging previews, automated testing, and comprehensive documentation throughout the project lifecycle.</p>
    `,
    pageType: "service",
    featuredImage: "/images/portfolio/khanherbals.webp",
    featuredImageAlt: "Glovax Technologies custom web application architecture and development",
    featuredImageTitle: "Web Development Services — Glovax Technologies",
    seoTitle: "Professional Web Development Services | Glovax Technologies",
    metaDescription:
      "Glovax Technologies provides world-class web development, custom Next.js applications, and enterprise SaaS solutions designed for speed and search ranking.",
    focusKeyword: "web development services",
    secondaryKeywords: [
      "custom web development",
      "Next.js web development",
      "full stack web development",
      "software development company",
    ],
    canonicalUrl: "https://www.glovaxtechnologies.com/web-development-services",
    robotsIndex: true,
    robotsFollow: true,
    includeInSitemap: true,
    sitemapPriority: 0.9,
    changeFrequency: "weekly",
    ogTitle: "Professional Web Development Services | Glovax Technologies",
    ogDescription:
      "Explore high-performance web development and custom software solutions engineered by Glovax Technologies.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Glovax Technologies Web Development Services",
    twitterTitle: "Professional Web Development Services | Glovax Technologies",
    twitterDescription:
      "High-performance custom web development and enterprise web applications engineered by Glovax Technologies.",
    twitterImage: "/images/glovax-og.png",
    schemaType: "Service",
    faqs: [
      {
        question: "What frameworks does Glovax Technologies specialize in for web development?",
        answer:
          "We specialize in React, Next.js (App Router), TypeScript, Node.js, and modern cloud databases such as LibSQL/Turso and PostgreSQL to guarantee optimal speed and SEO performance.",
      },
      {
        question: "How does Glovax Technologies ensure high SEO rankings for new websites?",
        answer:
          "All websites engineered by Glovax Technologies are built with semantic HTML, automated server-side metadata generation, OpenGraph tags, JSON-LD structured data, and sub-second Core Web Vitals performance.",
      },
      {
        question: "Can Glovax Technologies build custom integrations and APIs?",
        answer:
          "Yes, we design and build secure RESTful and GraphQL APIs, third-party payment gateways (Stripe, PayPal), CRM integrations, and automated background workers.",
      },
    ],
    status: "published",
    author: "Glovax Team",
    featured: true,
    readTime: 4,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "page-mobile-app-dev",
    title: "Mobile App Development Services",
    slug: "mobile-app-development",
    excerpt:
      "Native and cross-platform mobile apps for iOS and Android engineered for intuitive UX, real-time synchronization, and top app store rankings.",
    content: `
      <h2>Transforming Ideas into Intuitive Mobile Experiences</h2>
      <p>At <strong>Glovax Technologies</strong>, we design and build native-quality mobile applications for iOS and Android that users love and return to daily. Whether you are launching a consumer mobile application, a B2B enterprise tool, or an on-demand service marketplace, our engineering team brings your vision to market with speed and technical rigor.</p>
      
      <h2>Cross-Platform and Native Mobile Engineering</h2>
      <p>We leverage modern mobile frameworks including React Native, Flutter, and native Swift/Kotlin to deliver silky-smooth 60fps animations, offline data persistence, and robust security.</p>
      
      <ul>
        <li><strong>Cross-Platform Efficiency:</strong> Single codebase deployment for iOS and Android with zero performance compromises.</li>
        <li><strong>Push Notifications & Real-Time Sync:</strong> Keep your users informed and engaged with instant alerts and background workers.</li>
        <li><strong>App Store Optimization (ASO):</strong> Strategic keyword integration and compliant asset preparation for the Apple App Store and Google Play Store.</li>
        <li><strong>Secure Payment & Biometrics:</strong> Native Apple Pay, Google Pay, Face ID, and biometric authentication integration.</li>
      </ul>
    `,
    pageType: "service",
    featuredImage: "/images/portfolio/khanherbals.webp",
    featuredImageAlt: "Glovax Technologies cross-platform mobile app development for iOS and Android",
    featuredImageTitle: "Mobile App Development — Glovax Technologies",
    seoTitle: "Mobile App Development Services for iOS & Android | Glovax",
    metaDescription:
      "Glovax Technologies develops cross-platform and native mobile apps for iOS and Android with intuitive UX, real-time features, and high retention.",
    focusKeyword: "mobile app development",
    secondaryKeywords: [
      "iOS app development",
      "Android app development",
      "React Native development",
      "mobile application company",
    ],
    canonicalUrl: "https://www.glovaxtechnologies.com/mobile-app-development",
    robotsIndex: true,
    robotsFollow: true,
    includeInSitemap: true,
    sitemapPriority: 0.9,
    changeFrequency: "weekly",
    ogTitle: "Mobile App Development Services | Glovax Technologies",
    ogDescription:
      "Launch high-performance iOS and Android mobile apps with Glovax Technologies.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Glovax Technologies Mobile App Services",
    twitterTitle: "Mobile App Development Services | Glovax Technologies",
    twitterDescription: "Native and cross-platform mobile applications engineered by Glovax Technologies.",
    twitterImage: "/images/glovax-og.png",
    schemaType: "Service",
    faqs: [
      {
        question: "Do you build apps for both iOS and Android simultaneously?",
        answer:
          "Yes, we build using high-performance cross-platform technologies like React Native and Flutter that share up to 90% of business logic while maintaining authentic native interfaces for each platform.",
      },
      {
        question: "Does Glovax Technologies assist with App Store and Google Play submissions?",
        answer:
          "Yes, we handle the entire release process including certificate provisioning, store guidelines compliance, metadata optimization, and publication support.",
      },
    ],
    status: "published",
    author: "Glovax Team",
    featured: true,
    readTime: 3,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "page-ai-solutions",
    title: "AI & Machine Learning Solutions",
    slug: "ai-solutions",
    excerpt:
      "Custom AI agents, LLM integrations, Retrieval-Augmented Generation (RAG) systems, and predictive machine learning models built for enterprise efficiency.",
    content: `
      <h2>Empowering Modern Enterprises with Applied Artificial Intelligence</h2>
      <p>Artificial intelligence is redefining competitive advantage across industries. At <strong>Glovax Technologies</strong>, we move beyond basic prompts to engineer production-ready AI solutions, RAG knowledge systems, and intelligent workflow automation tailored directly to your proprietary company data.</p>
      
      <h2>Our Core AI Capabilities</h2>
      <ul>
        <li><strong>Custom LLM & AI Agents:</strong> Domain-specific conversational agents and autonomous workflow bots.</li>
        <li><strong>Retrieval-Augmented Generation (RAG):</strong> Ground AI responses in your internal knowledge bases, PDFs, and databases with semantic vector search.</li>
        <li><strong>Predictive Analytics & Computer Vision:</strong> Custom machine learning models trained on your business metrics for forecasting and anomaly detection.</li>
        <li><strong>MLOps & Cloud Infrastructure:</strong> Scalable model hosting, rate limiting, token cost optimization, and secure API gateways.</li>
      </ul>
    `,
    pageType: "service",
    featuredImage: "/images/portfolio/khanherbals.webp",
    featuredImageAlt: "Glovax Technologies enterprise AI and machine learning engineering",
    featuredImageTitle: "AI Solutions — Glovax Technologies",
    seoTitle: "Enterprise AI & Machine Learning Solutions | Glovax Technologies",
    metaDescription:
      "Glovax Technologies builds custom AI agents, RAG knowledge engines, and machine learning pipelines that automate complex business workflows.",
    focusKeyword: "AI solutions",
    secondaryKeywords: [
      "machine learning development",
      "enterprise AI development",
      "RAG systems",
      "custom LLM applications",
    ],
    canonicalUrl: "https://www.glovaxtechnologies.com/ai-solutions",
    robotsIndex: true,
    robotsFollow: true,
    includeInSitemap: true,
    sitemapPriority: 0.9,
    changeFrequency: "weekly",
    ogTitle: "Enterprise AI Solutions | Glovax Technologies",
    ogDescription: "Scale your operations with custom AI agents and machine learning from Glovax Technologies.",
    ogImage: "/images/glovax-og.png",
    ogImageAlt: "Glovax Technologies AI Solutions",
    twitterTitle: "Enterprise AI Solutions | Glovax Technologies",
    twitterDescription: "Applied Artificial Intelligence and ML engineering from Glovax Technologies.",
    twitterImage: "/images/glovax-og.png",
    schemaType: "Service",
    faqs: [
      {
        question: "How does Glovax Technologies protect proprietary company data when building AI tools?",
        answer:
          "We prioritize data privacy with private VPC deployments, enterprise zero-data-retention agreements, and local vector embeddings that never expose your IP to public model training.",
      },
    ],
    status: "published",
    author: "Glovax Team",
    featured: true,
    readTime: 3,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedPages() {
  console.log("Seeding initial CMS pages for Glovax Technologies...");
  for (const page of initialPages) {
    const existing = await db.select().from(schema.pages).where(eq(schema.pages.slug, page.slug));
    if (existing.length === 0) {
      await db.insert(schema.pages).values(page as any);
      console.log(`Inserted page: ${page.title} (/${page.slug})`);
    } else {
      console.log(`Page already exists: /${page.slug}`);
    }
  }
  console.log("CMS Pages seeding complete.");
  client.close();
}

seedPages();
