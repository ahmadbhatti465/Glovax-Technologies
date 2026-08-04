import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbJsonLd, AboutPageJsonLd } from "@/components/shared/StructuredData";
import AboutContent from "./about-content";
import { getSiteContent, getSiteContentUpdatedAt } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — Global Software House",
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

export default async function AboutPage() {
  const about = await getSiteContent<{
    heroEyebrow: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    stats: { value: number; suffix: string; label: string }[];
    values: { icon: string; title: string; description: string }[];
    timeline: { year: string; event: string }[];
  }>("about");
  const lastUpdated = await getSiteContentUpdatedAt("about");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ]}
      />
      <AboutPageJsonLd />
      <AboutContent about={about} lastUpdated={lastUpdated} />
    </>
  );
}
