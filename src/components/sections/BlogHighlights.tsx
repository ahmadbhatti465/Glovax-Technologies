import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogPostListItem } from "@/types";

interface BlogHighlightsProps {
  posts: BlogPostListItem[];
}

/**
 * Latest articles on the homepage. Links from the most-crawled page to
 * individual posts — beyond /blog — so Google can discover and value the
 * newer/thinner articles that otherwise only have a single internal link.
 */
export function BlogHighlights({ posts }: BlogHighlightsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeader
          eyebrow="Insights"
          title="Latest from the"
          titleHighlight="Blog"
          subtitle="Practical guides on AI, web development, cloud, and digital growth — written by the team building them."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <article
              data-reveal
              style={{ ["--stagger" as string]: index * 0.05 }}
              key={post.slug}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
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

                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Read Article
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            View all articles
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
