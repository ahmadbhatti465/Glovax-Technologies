import type { Metadata } from "next";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import BlogContent from "./blog-content";
import { getBlogPosts } from "@/lib/data";
import { BLOG_PAGE_SIZE } from "@/lib/blog-pagination";

export const revalidate = 60;

const blogMetadata: Metadata = {
  title: "Tech Blog: AI, Web & Cloud",
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
    images: [ogImage],
  },
};

export const metadata: Metadata = blogMetadata;

export default async function BlogPage() {
  const allPosts = await getBlogPosts("published");
  const posts = allPosts.slice(0, BLOG_PAGE_SIZE).map(
    ({ slug, title, excerpt, category, readTime }) => ({
      slug,
      title,
      excerpt,
      category,
      readTime,
    })
  );
  const categories = [...new Set(allPosts.map((post) => post.category))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const lastUpdated = allPosts.reduce<Date | null>((latest, post) => {
    const updatedAt = post.updatedAt ? new Date(post.updatedAt) : null;
    return updatedAt && (!latest || updatedAt > latest) ? updatedAt : latest;
  }, null);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
        ]}
      />
      <BlogContent
        posts={posts}
        lastUpdated={lastUpdated}
        currentPage={1}
        totalPages={Math.max(1, Math.ceil(allPosts.length / BLOG_PAGE_SIZE))}
        categoryList={categories}
      />
    </>
  );
}
