import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd, JobPostingJsonLd } from "@/components/shared/StructuredData";
import CareerContent from "./career-content";
import { getJobPositions, getSiteContent, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Remote Tech Careers",
  description:
    "Join Glovax Technologies. We're hiring engineers, designers, product managers, and AI researchers. Remote-first culture with competitive benefits.",
  keywords: [
    "tech jobs",
    "software engineer jobs",
    "remote tech jobs",
    "AI engineer hiring",
    "full stack developer jobs",
    "UX designer jobs",
    "DevOps engineer jobs",
    "software house careers",
    "Glovax Technologies careers",
  ],
  alternates: {
    canonical: `${siteConfig.url}/career`,
  },
  openGraph: {
    url: `${siteConfig.url}/career`,
    title: `Remote Tech Careers | ${siteConfig.name}`,
    description:
      "We're always looking for exceptional people who are passionate about building great products.",
    type: "website",
    images: [ogImage],
  },
};

const careerFaqs = [
  {
    question: "Is Glovax Technologies a remote-first company?",
    answer:
      "Yes. We are a remote-first team and hire talented people from anywhere in the world. Our async workflows accommodate any timezone.",
  },
  {
    question: "What roles are currently open at Glovax Technologies?",
    answer:
      "Our open positions are listed below and updated as new roles are approved. If you don't see a perfect fit, you can still reach out through our contact form.",
  },
  {
    question: "How do I apply for a position?",
    answer:
      "Click the 'Apply Now' button on any open position to reach our contact form, or email your resume and portfolio directly to info@glovaxtechnologies.com.",
  },
];

export default async function CareerPage() {
  const positions = await getJobPositions();
  const benefits = await getSiteContent<string[]>("career_benefits");
  const lastUpdated = await getLatestUpdatedAt(["jobPositions"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Careers", url: `${siteConfig.url}/career` },
        ]}
      />
      <JobPostingJsonLd positions={positions} />
      <CareerContent
        positions={positions}
        benefits={benefits ?? undefined}
        faqs={careerFaqs}
        lastUpdated={lastUpdated}
      />
    </>
  );
}
