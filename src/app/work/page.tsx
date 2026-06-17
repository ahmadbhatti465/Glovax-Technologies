import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import WorkContent from "./work-content";

export const metadata: Metadata = {
  title: "Portfolio",
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
    title: `Portfolio | ${siteConfig.name}`,
    description:
      "A curated collection of our finest work across web, mobile, AI, and cloud infrastructure.",
    type: "website",
  },
};

export default function WorkPage() {
  return <WorkContent />;
}
