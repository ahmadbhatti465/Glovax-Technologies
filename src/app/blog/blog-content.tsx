"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

interface BlogContentProps {
  posts?: BlogPost[];
  lastUpdated?: Date | null;
}

export default function BlogContent({ posts = [], lastUpdated }: BlogContentProps) {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }]} />
          <SectionHeader
            as="h1"
            eyebrow="Blog"
            title="Insights &"
            titleHighlight="Perspectives"
            subtitle="Thoughts on technology, design, and building products that matter."
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

          {posts.length === 0 && (
            <p className="text-center text-muted">
              No articles published yet. Check back soon for insights on AI, web development, and cloud engineering.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
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

                    <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

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
        </div>
      </main>
      <Footer />
    </>
  );
}
