import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getRelatedPosts, getAllBlogSlugs, getRedirect, getBlogPosts } from "@/lib/data";
import { siteConfig, ogImage as defaultOgImage } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { FAQJsonLD, BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { ArrowLeft, ArrowRight, Clock, Calendar, RefreshCw, User, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FAQItem } from "@/types";
import { toBlogTaxonomySlug } from "@/lib/blog-taxonomy";
import { normalizeCanonicalUrl, toIsoDate } from "@/lib/utils";
import { PageBackdrop } from "@/components/shared/PageBackdrop";
import { ArticleBody } from "@/components/blog/ArticleBody";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const redir = (await getRedirect(`blog/${slug}`)) || (await getRedirect(slug));
  if (redir) {
    return { title: "Redirecting...", robots: { index: false, follow: false } };
  }

  const post = await getBlogPostBySlug(slug, false);
  if (!post) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist or has been moved.",
      robots: { index: false, follow: false },
    };
  }

  const url = normalizeCanonicalUrl(post.canonicalUrl, `/blog/${post.slug}`);
  const title = post.seoTitle || `${post.title} | ${siteConfig.name}`;
  const description = (post.metaDescription || post.excerpt).slice(0, 160);

  const ogImageUrl = post.ogImage || post.featuredImage || siteConfig.ogImage;
  const resolvedOgImage = ogImageUrl.startsWith("http") || ogImageUrl.startsWith("data:")
    ? ogImageUrl
    : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  const shouldIndex = (post.status || "published") === "published" && post.robotsIndex !== false;
  const shouldFollow = post.robotsFollow !== false;

  return {
    title: { absolute: title },
    description,
    keywords: post.secondaryKeywords && post.secondaryKeywords.length > 0 ? post.secondaryKeywords : post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      publishedTime: toIsoDate(post.publishedAt),
      modifiedTime: post.updatedAt?.toISOString() || toIsoDate(post.publishedAt),
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: post.ogImageAlt || post.featuredImageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || post.ogTitle || title,
      description: post.twitterDescription || post.ogDescription || description,
      images: [post.twitterImage || resolvedOgImage],
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

function extractFaqsFromMarkdown(content: string): FAQItem[] {
  const faqMatch = content.match(/## FAQ\s*([\s\S]*?)$/);
  if (!faqMatch) return [];
  const faqSection = faqMatch[1].trim();
  const blocks = faqSection.split(/^### /m).filter((b) => b.trim().length > 0);
  return blocks.map((block) => {
    const lines = block.trim().split("\n");
    const question = lines[0].trim();
    const answer = lines.slice(1).join(" ").trim();
    return { question, answer };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check 301 Permanent Redirect
  const redir = (await getRedirect(`blog/${slug}`)) || (await getRedirect(slug));
  if (redir) {
    redirect(redir.destination, RedirectType.replace);
  }

  const post = await getBlogPostBySlug(slug, false);
  if (!post) notFound();

  const url = normalizeCanonicalUrl(post.canonicalUrl, `/blog/${post.slug}`);
  const faqs = (post.faqs && post.faqs.length > 0) ? post.faqs : extractFaqsFromMarkdown(post.content);
  const relatedPosts = await getRelatedPosts(post.slug, post.category, 4);
  const serviceByCategory: Record<string, string> = {
    "AI & Machine Learning": "AI engineering and machine learning services",
    "AI Solutions": "AI engineering and machine learning services",
    "Web Development": "web development services",
    "Mobile Apps": "mobile app development services",
    "Mobile Development": "mobile app development services",
    "Cloud & DevOps": "cloud and DevOps services",
    "Cloud Computing": "cloud and DevOps services",
    "SaaS & Cloud": "cloud and DevOps services",
    "Digital Marketing": "digital marketing services",
    "SEO & Growth": "digital marketing services",
    "UI/UX Design": "UI/UX design services",
  };
  const relatedService = serviceByCategory[post.category];

  // Get all published posts to determine Previous and Next articles for continuous internal crawl graph
  const allPosts = await getBlogPosts("published");
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const currentIndex = sortedPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const ogImageUrl = post.ogImage || post.featuredImage || siteConfig.ogImage;
  const resolvedOgImage = ogImageUrl.startsWith("http") || ogImageUrl.startsWith("data:")
    ? ogImageUrl
    : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: toIsoDate(post.publishedAt),
    dateModified: post.updatedAt
      ? (post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString())
      : toIsoDate(post.publishedAt),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: post.author || siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    keywords: post.tags.join(", "),
    image: [resolvedOgImage],
  };

  const publishedDate = new Date(post.publishedAt);
  const modifiedDate = post.updatedAt || publishedDate;

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative isolate outline-none pt-28 pb-24 min-h-screen">
        <PageBackdrop />
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          {/* Draft Preview Warning Banner */}
          {post.status && post.status !== "published" && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <strong>Admin Preview Mode:</strong> This article is currently a <strong>{post.status.toUpperCase()}</strong>. It is not publicly indexable by search engines until published.
              </div>
            </div>
          )}

          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.category, href: `/blog/category/${toBlogTaxonomySlug(post.category)}` },
              { label: post.title },
            ]}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "Home", url: siteConfig.url },
              { name: "Blog", url: `${siteConfig.url}/blog` },
              {
                name: post.category,
                url: `${siteConfig.url}/blog/category/${toBlogTaxonomySlug(post.category)}`,
              },
              { name: post.title, url },
            ]}
          />
          {faqs.length > 0 && <FAQJsonLD items={faqs} />}

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-2.5 py-1 text-xs font-medium bg-surface-raised border border-border rounded-full text-accent">
              {post.category}
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
              {post.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {post.author || "Glovax Team"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            By {post.author || "Glovax Team"}, writing about {post.category} at {siteConfig.name}.
            {post.updatedAt && new Date(post.updatedAt).getTime() > publishedDate.getTime() && (
              <> Updated {new Date(post.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}.</>
            )}
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
            {post.title}
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="my-8 rounded-2xl overflow-hidden border border-border bg-surface relative aspect-[16/9] shadow-xl">
              <Image
                src={
                  post.featuredImage.startsWith("/") || post.featuredImage.startsWith("http")
                    ? post.featuredImage
                    : `/${post.featuredImage}`
                }
                alt={post.featuredImageAlt || post.title}
                title={post.featuredImageTitle || undefined}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
              {post.featuredImageCaption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-4 py-2 text-xs text-gray-300 text-center">
                  {post.featuredImageCaption}
                </div>
              )}
            </div>
          )}

          <div className="w-24 h-px bg-gradient-to-r from-teal/70 to-transparent mb-10" />

          {/* Article Body */}
          <article className="prose prose-invert max-w-none text-foreground/90 leading-relaxed space-y-6">
            <ArticleBody content={post.content} />
          </article>

          {relatedService && (
            <p className="mt-8 text-sm text-muted-foreground">
              Need help applying these ideas? Explore our{" "}
              <Link href="/services" className="text-accent underline underline-offset-4">
                {relatedService}
              </Link>.
            </p>
          )}

          {/* Interactive FAQs Accordion */}
          {faqs.length > 0 && <FaqAccordion items={faqs} />}

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${toBlogTaxonomySlug(tag)}`}
                  className="px-3 py-1 text-xs rounded-full bg-surface border border-border text-muted-foreground"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Previous & Next Post Internal Navigation Loop */}
          {(prevPost || nextPost) && (
            <nav className="mt-14 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Previous and Next Article">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-all text-left"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <ChevronLeft className="w-3.5 h-3.5 text-accent" /> Previous Article
                  </span>
                  <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col p-4 rounded-xl bg-surface border border-border hover:border-accent/40 transition-all text-right sm:items-end"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    Next Article <ChevronRight className="w-3.5 h-3.5 text-accent" />
                  </span>
                  <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-16" aria-label="Related articles">
              <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block p-5 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
                  >
                    <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-surface-raised border border-border rounded-full text-muted-foreground mb-2.5">
                      {related.category}
                    </span>
                    <h3 className="text-sm font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {related.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="w-3 h-3" />
            <span>
              Last updated:{" "}
              {modifiedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="mt-16 p-8 rounded-2xl bg-surface border border-border text-center">
            <h3 className="text-2xl font-semibold mb-3">
              Want to build something like this?
            </h3>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Let&apos;s talk about your project. We respond within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/services"
                className="text-sm text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                Explore our services
              </Link>
              <MagneticButton href="/contact" variant="primary" size="lg">
                Start a Project
              </MagneticButton>
              <MagneticButton href="/contact" variant="outline" size="lg">
                Contact Us
              </MagneticButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
