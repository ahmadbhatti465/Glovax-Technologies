import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import CareerContent from "./career-content";

export const metadata: Metadata = {
  title: "Careers",
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
    title: `Careers | ${siteConfig.name}`,
    description:
      "We're always looking for exceptional people who are passionate about building great products.",
    type: "website",
  },
};

export default function CareerPage() {
  return <CareerContent />;
}
