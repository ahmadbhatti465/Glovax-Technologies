import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Glovax Technologies – our story, values, and the global team behind world-class software engineering, AI solutions, and digital products.",
  keywords: [
    "about Glovax Technologies",
    "software house team",
    "digital agency history",
    "AI company values",
    "global tech team",
    "web development company",
  ],
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    url: `${siteConfig.url}/about`,
    title: `About Us | ${siteConfig.name}`,
    description:
      "Meet the global team behind Glovax Technologies. Discover our story, values, and mission to build impactful digital products.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
