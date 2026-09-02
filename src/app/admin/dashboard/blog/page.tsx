"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Newspaper,
  Plus,
  Search,
  ChevronLeft,
  Pencil,
  Copy,
  Trash2,
  Eye,
  ExternalLink,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Tag,
  Star,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost } from "@/types";
import { calculateSeoScore } from "@/components/admin/pages/SeoScoreCard";
import { siteConfig } from "@/lib/constants";

export default function BlogManagement() {
  const { loading: authLoading } = useAuth(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updated" | "newest" | "oldest" | "title" | "seo">("updated");

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createRedirectOnDelete, setCreateRedirectOnDelete] = useState(true);
  const [deleteRedirectTarget, setDeleteRedirectTarget] = useState("/blog");

  // Duplicate state
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle Duplicate
  const handleDuplicate = async (post: BlogPost) => {
    setDuplicatingId(post.id);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        await fetchPosts();
      } else {
        alert("Failed to duplicate article");
      }
    } catch {
      alert("Error duplicating article");
    }
    setDuplicatingId(null);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (createRedirectOnDelete && deleteRedirectTarget) {
        await fetch("/api/admin/redirects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: `/blog/${deleteTarget.slug}`,
            destination: deleteRedirectTarget,
            statusCode: 301,
          }),
          credentials: "include",
        });
      }

      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setDeleteTarget(null);
        await fetchPosts();
      } else {
        alert("Failed to delete article");
      }
    } catch {
      alert("Error deleting article");
    }
    setDeleting(false);
  };

  // Precompute SEO scores for all posts
  const postsWithScores = useMemo(() => {
    return posts.map((p) => {
      const seo = calculateSeoScore({
        title: p.title,
        slug: `blog/${p.slug}`,
        seoTitle: p.seoTitle,
        metaDescription: p.metaDescription,
        focusKeyword: p.focusKeyword,
        content: p.content,
        featuredImage: p.featuredImage,
        featuredImageAlt: p.featuredImageAlt,
        robotsIndex: p.robotsIndex !== undefined ? p.robotsIndex : true,
      });
      return { ...p, seoScore: seo.score, seoGrade: seo.grade };
    });
  }, [posts]);

  // Get distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return postsWithScores
      .filter((p) => {
        if (statusFilter !== "all" && (p.status || "published") !== statusFilter) return false;
        if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSlug = p.slug.toLowerCase().includes(q);
          const matchAuthor = p.author?.toLowerCase().includes(q);
          const matchCategory = p.category?.toLowerCase().includes(q);
          const matchTags = Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q));
          const matchKeyword = p.focusKeyword?.toLowerCase().includes(q);
          if (!matchTitle && !matchSlug && !matchAuthor && !matchCategory && !matchTags && !matchKeyword) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "updated") {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : new Date(a.publishedAt).getTime();
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : new Date(b.publishedAt).getTime();
          return dateB - dateA;
        }
        if (sortBy === "newest") {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return dateB - dateA;
        }
        if (sortBy === "oldest") {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return dateA - dateB;
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "seo") {
          return b.seoScore - a.seoScore;
        }
        return 0;
      });
  }, [postsWithScores, statusFilter, categoryFilter, searchQuery, sortBy]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = postsWithScores.length;
    const published = postsWithScores.filter((p) => (p.status || "published") === "published").length;
    const drafts = postsWithScores.filter((p) => p.status === "draft").length;
    const featured = postsWithScores.filter((p) => p.featured).length;
    const avgScore =
      total > 0 ? Math.round(postsWithScores.reduce((acc, p) => acc + p.seoScore, 0) / total) : 0;
    return { total, published, drafts, featured, avgScore };
  }, [postsWithScores]);

  if (authLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Navigation */}
      <nav className="border-b border-[#1EDAC6]/20 bg-surface-raised sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-1.5 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">Blog CMS & Technical SEO</h1>
              <p className="text-[11px] text-gray-400">Manage Glovax Technologies articles, keywords & SEO</p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/blog/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(30,218,198,0.25)]"
          >
            <Plus className="w-4 h-4" /> Create Article
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Total Articles</span>
              <Newspaper className="w-4 h-4 text-[#1EDAC6]" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>

          <div className="bg-surface-raised border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-emerald-400">{stats.published}</span>
          </div>

          <div className="bg-surface-raised border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Drafts</span>
              <FileCheck className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-amber-400">{stats.drafts}</span>
          </div>

          <div className="bg-surface-raised border border-teal/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Featured</span>
              <Star className="w-4 h-4 text-[#1EDAC6]" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.featured}</span>
          </div>

          <div className="bg-surface-raised border border-[#1EDAC6]/25 rounded-xl p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Avg SEO Score</span>
              <Sparkles className="w-4 h-4 text-[#1EDAC6]" />
            </div>
            <span className="text-2xl font-bold text-[#1EDAC6]">{stats.avgScore}/100</span>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, slug, tag, or focus keyword..."
                className="w-full pl-9 pr-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
              >
                <option value="updated">Recently Updated</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical (A-Z)</option>
                <option value="seo">SEO Score (High-Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Table */}
        <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-xs">Loading articles…</div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Newspaper className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-gray-400 text-sm">No articles found matching your filters.</p>
              <Link
                href="/admin/dashboard/blog/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1EDAC6] text-black text-xs font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Create First Article
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface border-b border-[#1EDAC6]/10 text-gray-400 font-medium">
                    <th className="px-5 py-3.5">Article Title & Slug</th>
                    <th className="px-4 py-3.5">Category & Tags</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">SEO Score</th>
                    <th className="px-4 py-3.5">Published Date</th>
                    <th className="px-4 py-3.5">Read Time</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1EDAC6]/10">
                  {filteredPosts.map((post) => {
                    const isPublished = (post.status || "published") === "published";
                    const isDraft = post.status === "draft";
                    const isScheduled = post.status === "scheduled";

                    const scoreColor =
                      post.seoScore >= 85
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : post.seoScore >= 70
                        ? "text-[#1EDAC6] bg-[#1EDAC6]/10 border-[#1EDAC6]/30"
                        : post.seoScore >= 50
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30";

                    return (
                      <tr
                        key={post.id}
                        className="bg-card hover:bg-card-hover transition-colors group"
                      >
                        {/* Title & Slug */}
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-semibold text-white text-sm truncate group-hover:text-[#1EDAC6] transition-colors">
                            <Link href={`/admin/dashboard/blog/${post.id}`}>
                              {post.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 font-mono text-[11px] truncate">
                            <span>/blog/{post.slug}</span>
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-[#1EDAC6] transition-colors"
                              title="View live article"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Category & Tags */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#1EDAC6]/10 text-[#1EDAC6] border border-[#1EDAC6]/20 block w-fit mb-1">
                            {post.category}
                          </span>
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {(post.tags || []).slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5"
                              >
                                #{t}
                              </span>
                            ))}
                            {(post.tags || []).length > 2 && (
                              <span className="text-[10px] text-gray-500">
                                +{(post.tags || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : isScheduled
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                                : isDraft
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                            }`}
                          >
                            {post.status || "published"}
                          </span>
                        </td>

                        {/* SEO Score */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${scoreColor}`}
                          >
                            {post.seoScore}/100
                          </span>
                        </td>

                        {/* Published Date */}
                        <td className="px-4 py-4 whitespace-nowrap text-gray-300 text-[11px]">
                          {post.publishedAt || "—"}
                        </td>

                        {/* Read Time */}
                        <td className="px-4 py-4 whitespace-nowrap text-gray-400 text-[11px]">
                          {post.readTime} min
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/blog/${post.id}`}
                              className="p-1.5 rounded-md hover:bg-[#1EDAC6]/10 text-[#1EDAC6] transition-colors"
                              title="Edit Article"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>

                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 transition-colors"
                              title="Preview Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDuplicate(post)}
                              disabled={duplicatingId === post.id}
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 transition-colors disabled:opacity-50"
                              title="Duplicate Article"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(post)}
                              className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-red-500/25 rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" /> Confirm Deletion
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">&quot;{deleteTarget.title}&quot;</strong> (/blog/{deleteTarget.slug})?
            </p>

            <div className="p-3 rounded-lg bg-card border border-white/10 space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer text-gray-200">
                <input
                  type="checkbox"
                  checked={createRedirectOnDelete}
                  onChange={(e) => setCreateRedirectOnDelete(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded mt-0.5"
                />
                <span>Create a 301 redirect to avoid 404 errors for search engines</span>
              </label>

              {createRedirectOnDelete && (
                <div className="pt-1">
                  <label className="block text-[11px] text-gray-400 mb-1">Redirect Destination URL</label>
                  <input
                    type="text"
                    value={deleteRedirectTarget}
                    onChange={(e) => setDeleteRedirectTarget(e.target.value)}
                    placeholder="/blog"
                    className="w-full px-2.5 py-1.5 bg-background border border-white/10 rounded text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
