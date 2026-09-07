import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { getPortfolioItems, getPortfolioItemByIdOrSlug, getRedirect } from "@/lib/data";
import { enrichWithCaseStudy } from "@/data/case-studies";
import { siteConfig, ogImage as defaultOgImage } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import CaseStudyContent from "./case-study-content";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const items = await getPortfolioItems("published");
    const paramsList: { id: string }[] = [];
    items.forEach((p) => {
      paramsList.push({ id: p.id });
      if (p.slug && p.slug !== p.id) {
        paramsList.push({ id: p.slug });
      }
    });
    return paramsList;
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

  // Check 301 Redirect first
  const redir = await getRedirect(`/work/${id}`);
  if (redir) {
    return { title: "Redirecting...", robots: { index: false, follow: false } };
  }

  const rawItem = await getPortfolioItemByIdOrSlug(id, true);
  if (!rawItem) {
    return {
      title: "Case Study Not Found",
      description: "The case study you're looking for doesn't exist or has been moved.",
      robots: { index: false, follow: false },
    };
  }

  const project = enrichWithCaseStudy(rawItem);
  const slug = project.slug || project.id;
  const canonicalUrl = project.canonicalUrl || `${siteConfig.url}/work/${slug}`;
  const title = project.seoTitle || `${project.title} | Case Study | ${siteConfig.name}`;
  const description =
    project.metaDescription ||
    project.shortDescription ||
    project.description.slice(0, 160);

  const rawImage = project.ogImage || project.image || defaultOgImage.url;
  const resolvedOgImage = rawImage.startsWith("http") || rawImage.startsWith("data:")
    ? rawImage
    : `${siteConfig.url}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`;

  const isPublished = (project.status || "published") === "published";
  const shouldIndex = isPublished && (project.robotsIndex !== false);
  const shouldFollow = project.robotsFollow !== false;

  const keywords =
    project.secondaryKeywords && project.secondaryKeywords.length > 0
      ? project.secondaryKeywords
      : project.technologies;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: project.ogTitle || title,
      description: project.ogDescription || description,
      siteName: siteConfig.name,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: project.ogImageAlt || project.imageAlt || project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.twitterTitle || project.ogTitle || title,
      description: project.twitterDescription || project.ogDescription || description,
      images: [project.twitterImage || resolvedOgImage],
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function CaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { id } = await params;
  const searchParamsObj = searchParams ? await searchParams : {};
  const isPreview = searchParamsObj.preview === "true";

  // Check 301 Permanent Redirect
  const redir = await getRedirect(`/work/${id}`);
  if (redir) {
    redirect(redir.destination, RedirectType.replace);
  }

  const rawItem = await getPortfolioItemByIdOrSlug(id, isPreview);
  if (!rawItem) {
    notFound();
  }

  const project = enrichWithCaseStudy(rawItem);
  const slug = project.slug || project.id;
  const pageUrl = project.canonicalUrl || `${siteConfig.url}/work/${slug}`;

  // Fetch related projects
  const allItems = await getPortfolioItems("published");
  let related = allItems.filter((p) => p.id !== project.id && (p.slug || p.id) !== slug);
  if (project.relatedProjects && project.relatedProjects.length > 0) {
    const specified = allItems.filter((p) => project.relatedProjects!.includes(p.id));
    if (specified.length > 0) {
      related = specified;
    }
  }
  const relatedDisplay = related.slice(0, 2);

  // Dynamic JSON-LD Schema
  const schemaType = project.schemaType || "CreativeWork";
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType === "None" ? "CreativeWork" : schemaType,
    name: project.title,
    headline: project.title,
    description: project.metaDescription || project.shortDescription || project.description,
    image: project.image
      ? project.image.startsWith("http") || project.image.startsWith("data:")
        ? project.image
        : `${siteConfig.url}${project.image.startsWith("/") ? "" : "/"}${project.image}`
      : undefined,
    about: project.category,
    genre: project.industry || project.category,
    keywords: (project.technologies || []).join(", "),
    creator: {
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
      "@id": pageUrl,
    },
  };

  if (project.publishedAt) {
    schema.datePublished = project.publishedAt;
  }
  if (project.updatedAt) {
    schema.dateModified = new Date(project.updatedAt).toISOString();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Work", url: `${siteConfig.url}/work` },
          { name: project.title, url: pageUrl },
        ]}
      />
      {schemaType !== "None" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <CaseStudyContent project={project} related={relatedDisplay} isPreview={isPreview} />
    </>
  );
}
