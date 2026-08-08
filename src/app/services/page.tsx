import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import {
  BreadcrumbJsonLd,
  FAQJsonLD,
  ServiceJsonLd,
} from "@/components/shared/StructuredData";
import ServicesContent from "./services-content";
import { getServices, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Software Development Services",
  description:
    "End-to-end digital services: AI-powered web development, mobile apps, cloud & DevOps, UI/UX design, and digital marketing that drives real business growth.",
  keywords: [
    "web development services",
    "mobile app development",
    "AI solutions",
    "cloud services",
    "DevOps consulting",
    "UI UX design agency",
    "digital marketing agency",
    "SaaS development",
    "software house services",
    "custom software development",
  ],
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    url: `${siteConfig.url}/services`,
    title: `Software Development Services | ${siteConfig.name}`,
    description:
      "Explore our end-to-end digital services: AI-powered web and mobile development, cloud infrastructure, and growth marketing.",
    type: "website",
    images: [ogImage],
  },
};

const faqs = [
  {
    question: "What services does Glovax Technologies offer?",
    answer:
      "We offer end-to-end digital services including AI-powered web development, mobile app development, cloud and DevOps engineering, UI/UX design, and digital marketing including SEO.",
  },
  {
    question: "How much does a typical project cost?",
    answer:
      "Project costs vary based on scope, complexity, and timeline. Most engagements start from $10,000 and scale from there. Book a free consultation call and we will provide a tailored quote within 24 hours.",
  },
  {
    question: "How long does a project take to complete?",
    answer:
      "A typical MVP ships in 4 to 8 weeks. Larger production platforms take 3 to 6 months. We work in weekly sprints with transparent progress so you always know where your project stands.",
  },
  {
    question: "Do you work with clients worldwide?",
    answer:
      "Yes. We are a remote-first team that has delivered projects for clients across 30+ countries, with async workflows that accommodate any timezone.",
  },
  {
    question: "Do you provide ongoing maintenance after launch?",
    answer:
      "Yes. We offer monthly retainers for monitoring, security patches, performance optimization, and feature iteration so your product keeps improving after launch.",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  const lastUpdated = await getLatestUpdatedAt(["services"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Services", url: `${siteConfig.url}/services` },
        ]}
      />
      <FAQJsonLD items={faqs} />
      <ServiceJsonLd services={services} />
      <ServicesContent services={services} faqs={faqs} lastUpdated={lastUpdated} />
    </>
  );
}
