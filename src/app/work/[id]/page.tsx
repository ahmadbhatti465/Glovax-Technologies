import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItems } from "@/lib/data";
import { enrichWithCaseStudy } from "@/data/case-studies";
import { siteConfig, ogImage } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import CaseStudyContent from "./case-study-content";

export const dynamic = "force-static";

export async function generateStaticParams() {
  try {
    const items = await getPortfolioItems();
    return items.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const items = await getPortfolioItems();
  const item = items.find((p) => p.id === id);
  if (!item) {
    return {
      title: "Case Study Not Found",
      description: "The case study you're looking for doesn't exist or has been moved.",
      robots: { index: false, follow: false },
    };
  }

  const project = enrichWithCaseStudy(item);
  const url = `${siteConfig.url}/work/${id}`;
  const description = project.description.slice(0, 160);

  return {
    title: `${project.title} — Case Study`,
    description,
    keywords: project.technologies,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — Case Study | ${siteConfig.name}`,
      description,
      images: [
        {
          url: project.image
            ? `${siteConfig.url}${project.image}`
            : ogImage.url,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Case Study | ${siteConfig.name}`,
      description,
      images: [
        project.image ? `${siteConfig.url}${project.image}` : ogImage.url,
      ],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = await getPortfolioItems();
  const item = items.find((p) => p.id === id);
  if (!item) notFound();

  const project = enrichWithCaseStudy(item);
  const url = `${siteConfig.url}/work/${id}`;
  const related = items.filter((p) => p.id !== id && p.featured).slice(0, 2);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.image ? `${siteConfig.url}${project.image}` : undefined,
    about: project.category,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Work", url: `${siteConfig.url}/work` },
          { name: project.title, url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CaseStudyContent project={project} related={related} />
    </>
  );
}
