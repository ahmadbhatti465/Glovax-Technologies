import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { siteConfig } from "@/lib/constants";
import { getBlogPosts } from "@/lib/data";
import { toBlogTaxonomySlug } from "@/lib/blog-taxonomy";
import BlogContent from "../../blog-content";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

async function getTag(params: Params) {
  const { slug } = await params;
  const allPosts = await getBlogPosts("published");
  const tag = allPosts
    .flatMap((post) => post.tags)
    .find((value) => toBlogTaxonomySlug(value) === slug);

  if (!tag) notFound();
  const posts = allPosts.filter((post) =>
    post.tags.some((value) => toBlogTaxonomySlug(value) === slug)
  );
  return { slug, tag, posts };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts("published");
  const tags = new Set(
    posts.flatMap((post) => post.tags.map(toBlogTaxonomySlug)).filter(Boolean)
  );
  return [...tags].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, tag } = await getTag(params);
  const title = `${tag} Articles`;
  const description = `Read Glovax Technologies articles tagged ${tag}.`;
  const canonical = `${siteConfig.url}/blog/tag/${slug}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title, description },
  };
}

export default async function BlogTagPage({ params }: { params: Params }) {
  const { slug, tag, posts } = await getTag(params);
  const canonical = `${siteConfig.url}/blog/tag/${slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: `Tag: ${tag}`, url: canonical },
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
        heading={`Tag: ${tag}`}
        headingHighlight="Articles"
        subtitle={`Explore articles tagged ${tag}.`}
        breadcrumbLabel={`Tag: ${tag}`}
      />
    </>
  );
}
