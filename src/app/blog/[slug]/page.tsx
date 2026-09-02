import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getRelatedPosts, getAllBlogSlugs, getRedirect } from "@/lib/data";
import { siteConfig, ogImage as defaultOgImage } from "@/lib/constants";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { FAQJsonLD, BreadcrumbJsonLd } from "@/components/shared/StructuredData";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { ArrowLeft, Clock, Calendar, RefreshCw, User, Lock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FAQItem } from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  const redir = (await getRedirect(`blog/${slug}`)) || (await getRedirect(slug));
  if (redir) {
    return { title: "Redirecting...", robots: { index: false, follow: false } };
  }

  const post = await getBlogPostBySlug(slug, isPreview);
  if (!post) {
    return {
      title: "Article Not Found",
      description: "The article you're looking for doesn't exist or has been moved.",
      robots: { index: false, follow: false },
    };
  }

  const url = post.canonicalUrl || `${siteConfig.url}/blog/${post.slug}`;
  const title = post.seoTitle || `${post.title} | ${siteConfig.name}`;
  const description = post.metaDescription || post.excerpt.slice(0, 160);

  const ogImageUrl = post.ogImage || post.featuredImage || siteConfig.ogImage;
  const resolvedOgImage = ogImageUrl.startsWith("http")
    ? ogImageUrl
    : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  const shouldIndex = !isPreview && (post.status || "published") === "published" && post.robotsIndex !== false;
  const shouldFollow = !isPreview && post.robotsFollow !== false;

  return {
    title,
    description,
    keywords: post.secondaryKeywords && post.secondaryKeywords.length > 0 ? post.secondaryKeywords : post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt?.toISOString() || post.publishedAt,
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

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="text-2xl font-semibold mt-10 mb-4 text-foreground">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="text-xl font-semibold mt-6 mb-3 text-foreground">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(
          <li key={items.length} className="ml-6 list-disc text-foreground/90 leading-relaxed mb-1">
            {renderInline(lines[i].slice(2))}
          </li>
        );
        i++;
      }
      blocks.push(<ul key={key++} className="my-4">{items}</ul>);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(
          <li key={items.length} className="ml-6 list-decimal text-foreground/90 leading-relaxed mb-1">
            {renderInline(lines[i].replace(/^\d+\.\s/, ""))}
          </li>
        );
        i++;
      }
      blocks.push(<ol key={key++} className="my-4">{items}</ol>);
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-4 pl-4 border-l-2 border-accent/40 text-muted italic"
        >
          {renderInline(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={key++}
          className="my-4 p-4 rounded-lg bg-surface border border-border overflow-x-auto"
        >
          <code className="text-sm text-foreground/90 font-mono">{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="text-foreground/90 leading-relaxed mb-4">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderBold(text.slice(lastIndex, match.index)));
    }
    const [, label, href] = match;
    const isInternal = href.startsWith("/");
    parts.push(
      isInternal ? (
        <Link
          key={key++}
          href={href}
          className="text-accent hover:underline"
        >
          {label}
        </Link>
      ) : (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          {label}
        </a>
      )
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(renderBold(text.slice(lastIndex)));
  }

  return <>{parts}</>;
}

function renderBold(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  let start: number;

  while ((start = remaining.indexOf("**")) !== -1) {
    const end = remaining.indexOf("**", start + 2);
    if (end === -1) break;
    parts.push(remaining.slice(0, start));
    parts.push(
      <strong key={key++} className="font-semibold text-foreground">
        {remaining.slice(start + 2, end)}
      </strong>
    );
    remaining = remaining.slice(end + 2);
  }
  parts.push(remaining);
  return <>{parts}</>;
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  // Check 301 Permanent Redirect
  const redir = (await getRedirect(`blog/${slug}`)) || (await getRedirect(slug));
  if (redir) {
    redirect(redir.destination, RedirectType.replace);
  }

  const post = await getBlogPostBySlug(slug, isPreview);
  if (!post) notFound();

  const url = post.canonicalUrl || `${siteConfig.url}/blog/${post.slug}`;
  const faqs = (post.faqs && post.faqs.length > 0) ? post.faqs : extractFaqsFromMarkdown(post.content);
  const relatedPosts = await getRelatedPosts(post.slug, post.category, 3);

  const ogImageUrl = post.ogImage || post.featuredImage || siteConfig.ogImage;
  const resolvedOgImage = ogImageUrl.startsWith("http")
    ? ogImageUrl
    : `${siteConfig.url}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt?.toISOString() || post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author || siteConfig.name,
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
    keywords: post.tags.join(", "),
    image: [resolvedOgImage],
  };

  const publishedDate = new Date(post.publishedAt);
  const modifiedDate = post.updatedAt || publishedDate;

  // Check if content is rich HTML or raw Markdown
  const isHtml = /<[a-z][\s\S]*>/i.test(post.content);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
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
                sizes="(max-width: 768px) 100vw, 768px"
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
            {isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              renderMarkdown(post.content)
            )}
          </article>

          {/* Interactive FAQs Accordion */}
          {faqs.length > 0 && <FaqAccordion items={faqs} />}

          {post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-surface border border-border text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-16" aria-label="Related articles">
              <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300"
                  >
                    <span className="inline-block px-2.5 py-1 text-xs font-medium bg-surface-raised border border-border rounded-full text-muted-foreground mb-3">
                      {related.category}
                    </span>
                    <h3 className="text-base font-semibold mb-2 group-hover:text-accent transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">
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
              <MagneticButton href="/contact" variant="primary" size="lg">
                Start a Project
              </MagneticButton>
              <MagneticButton href="/contact" variant="outline" size="lg">
                Book a Call
              </MagneticButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
