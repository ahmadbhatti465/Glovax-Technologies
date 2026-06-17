import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import BlogContent from "./blog-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read insights on AI, web development, mobile apps, cloud computing, and digital marketing from the Glovax Technologies team.",
  keywords: [
    "tech blog",
    "AI blog",
    "web development blog",
    "cloud computing insights",
    "digital marketing tips",
    "software engineering blog",
    "technology trends 2026",
  ],
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description:
      "Thoughts on technology, design, and building products that matter.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
