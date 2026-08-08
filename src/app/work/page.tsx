import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/shared/StructuredData";
import WorkContent from "./work-content";
import { getPortfolioItems, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Web & Mobile Portfolio",
  description:
    "See our best work: web apps, mobile platforms, AI solutions, and cloud infrastructure projects delivered for clients worldwide by Glovax Technologies.",
  keywords: [
    "portfolio",
    "case studies",
    "web development portfolio",
    "mobile app portfolio",
    "AI projects",
    "software house work",
    "client projects",
    "digital agency portfolio",
  ],
  alternates: {
    canonical: `${siteConfig.url}/work`,
  },
  openGraph: {
    url: `${siteConfig.url}/work`,
    title: `Web & Mobile Portfolio | ${siteConfig.name}`,
    description:
      "A curated collection of our finest work across web, mobile, AI, and cloud infrastructure.",
    type: "website",
    images: [ogImage],
  },
};

const workFaqs = [
  {
    question: "What industries does Glovax Technologies serve?",
    answer:
      "We build digital products for fintech, healthtech, e-commerce, SaaS, logistics, education, and consumer startups across 30+ countries.",
  },
  {
    question: "Can I see live results for the projects in your portfolio?",
    answer:
      "Yes. Projects that are publicly available include a 'Visit Live Project' link directly from the case-study card.",
  },
  {
    question: "Do you sign NDAs before starting client work?",
    answer:
      "Absolutely. We treat every project as confidential and sign NDAs as a standard part of our engagement process.",
  },
];

export default async function WorkPage() {
  const portfolioItems = await getPortfolioItems();
  const lastUpdated = await getLatestUpdatedAt(["portfolioItems"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Portfolio", url: `${siteConfig.url}/work` },
        ]}
      />
      <CollectionPageJsonLd
        name="Glovax Technologies Portfolio"
        url={`${siteConfig.url}/work`}
        items={portfolioItems}
      />
      <WorkContent projects={portfolioItems} faqs={workFaqs} lastUpdated={lastUpdated} />
    </>
  );
}
