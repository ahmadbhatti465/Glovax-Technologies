import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd, TeamJsonLd } from "@/components/shared/StructuredData";
import TeamContent from "./team-content";
import { getTeamMembers, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Meet the Team",
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
    images: [ogImage],
  },
};

export default async function TeamPage() {
  const team = await getTeamMembers();
  const lastUpdated = await getLatestUpdatedAt(["teamMembers"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Team", url: `${siteConfig.url}/team` },
        ]}
      />
      <TeamJsonLd members={team} />
      <TeamContent team={team} lastUpdated={lastUpdated} />
    </>
  );
}
