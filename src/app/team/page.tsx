import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import TeamContent from "./team-content";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the leadership and experts at Glovax Technologies — engineers, AI researchers, designers, and strategists building digital products worldwide.",
  keywords: [
    "Glovax Technologies team",
    "software house team",
    "AI researchers",
    "web developers Pakistan",
    "tech leadership team",
  ],
  alternates: {
    canonical: `${siteConfig.url}/team`,
  },
  openGraph: {
    url: `${siteConfig.url}/team`,
    title: `Our Team | ${siteConfig.name}`,
    description:
      "Meet the global team behind Glovax Technologies — passionate innovators and problem-solvers.",
    type: "website",
  },
};

export default function TeamPage() {
  return <TeamContent />;
}
