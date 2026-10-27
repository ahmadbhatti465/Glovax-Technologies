"use client";

import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BlogPostSummary } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { toBlogTaxonomySlug } from "@/lib/blog-taxonomy";
import { PageBackdrop } from "@/components/shared/PageBackdrop";

interface BlogContentProps {
  posts?: BlogPostSummary[];
  lastUpdated?: Date | null;
  currentPage?: number;
  totalPages?: number;
  heading?: string;
  headingHighlight?: string;
  subtitle?: string;
  breadcrumbLabel?: string;
  categoryList?: string[];
}

export default function BlogContent({
  posts = [],
  lastUpdated,
  currentPage = 1,
  totalPages = 1,
  heading = "Insights &",
  headingHighlight = "Perspectives",
  subtitle = "Thoughts on technology, design, and building products that matter.",
  breadcrumbLabel,
  categoryList,
}: BlogContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of posts) if (p.category) seen.add(p.category);
    return ["All", ...Array.from(seen).sort()];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative isolate outline-none pt-28 pb-24">
        <PageBackdrop />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              ...(breadcrumbLabel ? [{ label: breadcrumbLabel }] : []),
            ]}
          />
          <SectionHeader
            as="h1"
            eyebrow="Blog"
            title={heading}
            titleHighlight={headingHighlight}
            subtitle={subtitle}
          />

          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-8 -mt-8 text-center">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {/* Category filter */}
          {(categoryList ?? categories).length > 0 && (
            <div
              className="flex flex-wrap items-center justify-center gap-2.5 mb-12"
              role="group"
              aria-label="Filter posts by category"
            >
              {categories.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={isActive}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-[0.97] ${
                      isActive
                        ? "gradient-cta text-accent-foreground shadow-glow"
                        : "bg-surface-raised border border-neutral-border text-muted-foreground hover:text-accent hover:border-white/[0.14]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          {categories.length > 1 && (
            <nav
              className="flex flex-wrap justify-center gap-2 mb-10"
              aria-label="Browse blog categories"
            >
              {(categoryList ?? categories)
                .filter((category) => category !== "All")
                .map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${toBlogTaxonomySlug(category)}`}
                  className="text-xs text-muted-foreground hover:text-accent underline underline-offset-4"
                >
                  {category} articles
                </Link>
              ))}
            </nav>
          )}

          {visiblePosts.length === 0 && (
            <p className="text-center text-muted">
              No articles in this category yet. Check back soon for insights on AI, web development, and cloud engineering.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-surface-raised border border-border rounded-full text-muted-foreground">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                    </div>

                    <h2 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="mt-12 flex flex-wrap items-center justify-center gap-2"
              aria-label="Blog pagination"
            >
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <Link
                  key={page}
                  href={page === 1 ? "/blog" : `/blog/page/${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`min-w-10 rounded-lg border px-3 py-2 text-center text-sm ${
                    page === currentPage
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
