"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogPost } from "@/types";

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    slug: "future-of-ai-in-business",
    title: "The Future of AI in Business: Trends to Watch",
    excerpt: "Explore the cutting-edge AI trends that will transform how businesses operate in 2026 and beyond.",
    content: "",
    author: "Glovax Team",
    category: "Artificial Intelligence",
    tags: [],
    publishedAt: "2026-02-15",
    readTime: 8,
    featured: false,
  },
  {
    id: "2",
    slug: "nextjs-15-complete-guide",
    title: "The Complete Guide to Next.js 15",
    excerpt: "Discover the latest features in Next.js 15 and learn how to leverage them to build faster applications.",
    content: "",
    author: "Glovax Team",
    category: "Web Development",
    tags: [],
    publishedAt: "2026-02-05",
    readTime: 10,
    featured: false,
  },
  {
    id: "3",
    slug: "seo-strategies-2026",
    title: "10 SEO Strategies That Actually Work in 2026",
    excerpt: "Search engine optimization has evolved. Here are the proven strategies to help your website rank higher.",
    content: "",
    author: "Glovax Team",
    category: "Digital Marketing",
    tags: [],
    publishedAt: "2026-01-28",
    readTime: 7,
    featured: false,
  },
  {
    id: "4",
    slug: "scalable-cloud-infrastructure",
    title: "Building Scalable Cloud Infrastructure",
    excerpt: "Lessons from building cloud infrastructure for Fortune 500 companies and how to apply them.",
    content: "",
    author: "Glovax Team",
    category: "Cloud Computing",
    tags: [],
    publishedAt: "2026-01-20",
    readTime: 9,
    featured: false,
  },
  {
    id: "5",
    slug: "mobile-app-trends-2026",
    title: "Mobile App Development Trends Shaping 2026",
    excerpt: "From AI-powered apps to cross-platform frameworks, discover the trends defining mobile development.",
    content: "",
    author: "Glovax Team",
    category: "Mobile Development",
    tags: [],
    publishedAt: "2026-01-08",
    readTime: 6,
    featured: false,
  },
  {
    id: "6",
    slug: "data-driven-culture",
    title: "How to Build a Data-Driven Culture",
    excerpt: "Transforming your organization to be truly data-driven requires more than just tools.",
    content: "",
    author: "Glovax Team",
    category: "Data Science",
    tags: [],
    publishedAt: "2026-01-02",
    readTime: 8,
    featured: false,
  },
];

export default function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);

  useEffect(() => {
    fetch("/api/public/blog")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPosts(data);
      })
      .catch(() => {});
  }, []);

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
