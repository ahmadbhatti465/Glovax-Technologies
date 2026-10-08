import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { siteConfig } from "@/lib/constants";
import { getBlogPosts } from "@/lib/data";
import { BLOG_PAGE_SIZE } from "@/lib/blog-pagination";
import BlogContent from "../../blog-content";

export const revalidate = 60;

type Params = Promise<{ page: string }>;

async function getPageData(params: Params) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  const posts = await getBlogPosts("published");
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));

  if (!Number.isInteger(page) || page < 2 || page > totalPages) {
    notFound();
  }

  return {
    page,
    posts: posts
      .slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE)
      .map(({ slug, title, excerpt, category, readTime }) => ({
        slug,
        title,
        excerpt,
        category,
        readTime,
      })),
    totalPages,
    categories: [...new Set(posts.map((post) => post.category))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)),
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts("published");
  const pageCount = Math.ceil(posts.length / BLOG_PAGE_SIZE);
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { page } = await getPageData(params);
  const title = `Tech Blog — Page ${page}`;
  const description = `Browse page ${page} of technology, AI, web development, and cloud engineering insights from Glovax Technologies.`;
  const canonical = `${siteConfig.url}/blog/page/${page}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title, description },
  };
}

export default async function PaginatedBlogPage({
  params,
}: {
  params: Params;
}) {
  const { page, posts, totalPages, categories } = await getPageData(params);
  const canonical = `${siteConfig.url}/blog/page/${page}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: `Page ${page}`, url: canonical },
        ]}
      />
      <BlogContent
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        categoryList={categories}
        heading={`Insights — Page ${page}`}
        headingHighlight="Perspectives"
        subtitle="More technology, design, and product engineering articles."
        breadcrumbLabel={`Page ${page}`}
      />
    </>
  );
}
