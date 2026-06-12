"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    slug: "future-of-ai-in-business",
    title: "The Future of AI in Business: Trends to Watch",
    excerpt:
      "Explore the cutting-edge AI trends that will transform how businesses operate in 2026 and beyond.",
    category: "Artificial Intelligence",
    readTime: 8,
    date: "2026-02-15",
  },
  {
    slug: "nextjs-15-complete-guide",
    title: "The Complete Guide to Next.js 15",
    excerpt:
      "Discover the latest features in Next.js 15 and learn how to leverage them to build faster applications.",
    category: "Web Development",
    readTime: 10,
    date: "2026-02-05",
  },
  {
    slug: "seo-strategies-2026",
    title: "10 SEO Strategies That Actually Work in 2026",
    excerpt:
      "Search engine optimization has evolved. Here are the proven strategies to help your website rank higher.",
    category: "Digital Marketing",
    readTime: 7,
    date: "2026-01-28",
  },
  {
    slug: "scalable-cloud-infrastructure",
    title: "Building Scalable Cloud Infrastructure",
    excerpt:
      "Lessons from building cloud infrastructure for Fortune 500 companies and how to apply them.",
    category: "Cloud Computing",
    readTime: 9,
    date: "2026-01-20",
  },
  {
    slug: "mobile-app-trends-2026",
    title: "Mobile App Development Trends Shaping 2026",
    excerpt:
      "From AI-powered apps to cross-platform frameworks, discover the trends defining mobile development.",
    category: "Mobile Development",
    readTime: 6,
    date: "2026-01-08",
  },
  {
    slug: "data-driven-culture",
    title: "How to Build a Data-Driven Culture",
    excerpt:
      "Transforming your organization to be truly data-driven requires more than just tools.",
    category: "Data Science",
    readTime: 8,
    date: "2026-01-02",
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            eyebrow="Blog"
            title="Insights &"
            titleHighlight="Perspectives"
            subtitle="Thoughts on technology, design, and building products that matter."
          />

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
