import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPageBySlug, getAllPageSlugs, getRedirect } from "@/lib/data";
import { siteConfig, ogImage as defaultOgImage } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FAQJsonLD, BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { Clock, Calendar, User, ArrowLeft, Lock } from "lucide-react";

export const revalidate = 3600; // ISR: revalidate once an hour
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPageSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const redir = await getRedirect(slug);
  if (redir) {
    return { title: "Redirecting...", robots: { index: false, follow: false } };
  }

  const page = await getPageBySlug(slug, false);
  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page does not exist or has been moved.",
      robots: { index: false, follow: false },
    };
  }

  const url = page.canonicalUrl || `${siteConfig.url}/${page.slug}`;
  const title = page.seoTitle || `${page.title} | ${siteConfig.name}`;
  const description = page.metaDescription || page.excerpt || siteConfig.description;

  const ogImageUrl = page.ogImage || page.featuredImage || siteConfig.ogImage;
  const resolvedOgImage = ogImageUrl.startsWith("http") || ogImageUrl.startsWith("data:") ? ogImageUrl : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  // If published, index and follow
  const shouldIndex = page.status === "published" && page.robotsIndex;
  const shouldFollow = page.robotsFollow;

  return {
    title,
    description,
    keywords: page.secondaryKeywords.length > 0 ? page.secondaryKeywords : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      siteName: siteConfig.name,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: page.ogImageAlt || page.featuredImageAlt || page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitterTitle || page.ogTitle || title,
      description: page.twitterDescription || page.ogDescription || description,
      images: [page.twitterImage || resolvedOgImage],
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

export default async function DynamicCmsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const searchParamsObj = searchParams ? await searchParams : {};
  const isPreview = searchParamsObj.preview === "true";

  // Check 301 Permanent Redirect first
  const redir = await getRedirect(slug);
  if (redir) {
    redirect(redir.destination, RedirectType.replace);
  }

  const page = await getPageBySlug(slug, isPreview);
  if (!page) {
    notFound();
  }

  const pageUrl = page.canonicalUrl || `${siteConfig.url}/${page.slug}`;
  const publishedDate = page.publishedAt ? new Date(page.publishedAt) : new Date(page.createdAt || Date.now());
  const modifiedDate = page.updatedAt ? new Date(page.updatedAt) : publishedDate;

  // Generate Structured Data Schema
  const structuredData: Record<string, unknown>[] = [];

  if (page.schemaType === "Service") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      description: page.metaDescription || page.excerpt,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}${siteConfig.logo}`,
      },
      url: pageUrl,
      serviceType: page.title,
      areaServed: "Worldwide",
    });
  } else if (page.schemaType === "AboutPage") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: page.title,
      url: pageUrl,
      description: page.metaDescription || page.excerpt,
      mainEntity: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    });
  } else if (page.schemaType === "ContactPage") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: page.title,
      url: pageUrl,
      mainEntity: {
        "@type": "Organization",
        name: siteConfig.name,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        url: siteConfig.url,
      },
    });
  } else if (page.schemaType === "SoftwareApplication") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: page.title,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: pageUrl,
      description: page.metaDescription || page.excerpt,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
      },
    });
  } else if (page.schemaType !== "None") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      url: pageUrl,
      description: page.metaDescription || page.excerpt,
      datePublished: publishedDate.toISOString(),
      dateModified: modifiedDate.toISOString(),
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}${siteConfig.logo}`,
        },
      },
    });
  }

  return (
    <>
      {/* Dynamic Structured Data */}
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: page.title, url: pageUrl },
        ]}
      />

      {page.faqs && page.faqs.length > 0 && <FAQJsonLD items={page.faqs} />}

      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          {/* Draft Preview Warning Banner */}
          {page.status !== "published" && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <strong>Admin Preview Mode:</strong> This page is currently a <strong>{page.status.toUpperCase()}</strong>. It is not publicly indexable by search engines until published.
              </div>
            </div>
          )}

          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: page.title },
            ]}
          />

          {/* Page Header */}
          <div className="mt-8 mb-10 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-surface-raised border border-border rounded-full text-accent">
                {page.pageType.replace(/_/g, " ")}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {publishedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {page.readTime || 3} min read
              </span>

              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                {page.author || "Glovax Team"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12] text-foreground">
              {page.title}
            </h1>

            {page.excerpt && (
              <p className="text-lg sm:text-xl text-muted leading-relaxed pt-2">
                {page.excerpt}
              </p>
            )}
          </div>

          {/* Featured Image */}
          {page.featuredImage && (
            <div className="my-10 rounded-2xl overflow-hidden border border-border bg-surface relative aspect-[16/9] shadow-2xl">
              <Image
                src={
                  page.featuredImage.startsWith("/") || page.featuredImage.startsWith("http")
                    ? page.featuredImage
                    : `/${page.featuredImage}`
                }
                alt={page.featuredImageAlt || page.title}
                title={page.featuredImageTitle || undefined}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
              {page.featuredImageCaption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-4 py-2 text-xs text-gray-300 text-center">
                  {page.featuredImageCaption}
                </div>
              )}
            </div>
          )}

          {/* Accent Line */}
          <div className="w-24 h-px bg-gradient-to-r from-teal/70 to-transparent my-10" />

          {/* Main Article Content */}
          <article
            className="prose prose-invert max-w-none text-foreground/90 leading-relaxed space-y-6 text-base sm:text-lg"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* FAQs Accordion */}
          {page.faqs && page.faqs.length > 0 && <FaqAccordion items={page.faqs} />}

          {/* Call To Action Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/[0.04] to-transparent pointer-events-none" />
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to accelerate your technology initiatives?
            </h3>
            <p className="text-muted text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Partner with Glovax Technologies for custom software, web platforms, mobile apps, and AI engineering that drives measurable growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton href="/contact" variant="primary" size="lg">
                Start a Project
              </MagneticButton>
              <MagneticButton href={siteConfig.calendarUrl} variant="outline" size="lg">
                Book a Consultation
              </MagneticButton>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
