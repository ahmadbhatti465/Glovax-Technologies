import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import ServicesContent from "./services-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "End-to-end digital services by Glovax Technologies: AI-powered web development, mobile apps, cloud & DevOps, UI/UX design, and digital marketing that drives growth.",
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
    title: `Our Services | ${siteConfig.name}`,
    description:
      "Explore our end-to-end digital services: AI-powered web and mobile development, cloud infrastructure, and growth marketing.",
    type: "website",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
