import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import BlogContent from "./blog-content";
import { getBlogPosts, getLatestUpdatedAt } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tech Blog: AI, Web & Cloud | Glovax Technologies",
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
    title: `Tech Blog | ${siteConfig.name}`,
    description:
      "Thoughts on technology, design, and building products that matter.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const lastUpdated = await getLatestUpdatedAt(["blogPosts"]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
        ]}
      />
      <BlogContent posts={posts} lastUpdated={lastUpdated} />
    </>
  );
}
