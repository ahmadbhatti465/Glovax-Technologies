import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { siteConfig } from "@/lib/constants";
import { getBlogPosts } from "@/lib/data";
import { toBlogTaxonomySlug } from "@/lib/blog-taxonomy";
import BlogContent from "../../blog-content";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function getCategory(params: Params) {
  const { slug } = await params;
  const allPosts = await getBlogPosts("published");
  const categories = [
    ...new Set(
      allPosts
        .map((post) => post.category)
        .filter((category) => toBlogTaxonomySlug(category) === slug)
    ),
  ];
  const category = categories.join(" / ");

  if (!category) notFound();
  const posts = allPosts.filter((post) => toBlogTaxonomySlug(post.category) === slug);
  return { slug, category, posts };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts("published");
  return [
    ...new Set(
      posts
        .map((post) => toBlogTaxonomySlug(post.category))
        .filter(Boolean)
    ),
  ].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, category } = await getCategory(params);
  const title = `${category} Articles`;
  const description = `Read Glovax Technologies articles about ${category}, software engineering, and digital products.`;
  const canonical = `${siteConfig.url}/blog/category/${slug}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title, description },
  };
}

export default async function BlogCategoryPage({ params }: { params: Params }) {
  const { slug, category, posts } = await getCategory(params);
  const canonical = `${siteConfig.url}/blog/category/${slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: category, url: canonical },
        ]}
      />
      <BlogContent
        posts={posts.map(({ slug, title, excerpt, category, readTime }) => ({
          slug,
          title,
          excerpt,
          category,
          readTime,
        }))}
        categoryList={[category]}
        heading={category}
        headingHighlight="Articles"
        subtitle={`Explore ${category} insights from the Glovax Technologies team.`}
        breadcrumbLabel={category}
      />
    </>
  );
}
