"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
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
  Building2,
  Globe,
  Radio,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { PortfolioItem } from "@/types";
import { calculateSeoScore } from "@/components/admin/pages/SeoScoreCard";
import { siteConfig } from "@/lib/constants";

export default function PortfolioManagement() {
  const { loading: authLoading } = useAuth(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"updated" | "newest" | "oldest" | "title" | "seo" | "client">("updated");

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [createRedirectOnDelete, setCreateRedirectOnDelete] = useState(true);
  const [deleteRedirectTarget, setDeleteRedirectTarget] = useState("/work");

  // Duplication state
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Quick toggle status
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/portfolio", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Handle Duplicate Project
  const handleDuplicate = async (item: PortfolioItem) => {
    setDuplicatingId(item.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        await fetchItems();
      } else {
        alert("Failed to duplicate portfolio project");
      }
    } catch {
      alert("Error duplicating portfolio project");
    }
    setDuplicatingId(null);
  };

  // Quick Publish/Unpublish toggle
  const handleTogglePublish = async (item: PortfolioItem) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      if (res.ok) {
        await fetchItems();
      } else {
        alert("Failed to update status");
      }
    } catch {
      alert("Error updating status");
    }
    setTogglingId(null);
  };

  // Handle Delete with 301 Redirect
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const targetSlug = deleteTarget.slug || deleteTarget.id;
      const queryParams = new URLSearchParams();
      if (createRedirectOnDelete && deleteRedirectTarget) {
        queryParams.set("createRedirect", "true");
        queryParams.set("redirectTarget", deleteRedirectTarget);
      }

      const res = await fetch(`/api/admin/portfolio/${deleteTarget.id}?${queryParams.toString()}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setDeleteTarget(null);
        await fetchItems();
      } else {
        alert("Failed to delete project");
      }
    } catch {
      alert("Error deleting project");
    }
    setDeleting(false);
  };

  // Precompute Real-time SEO Scores
  const itemsWithScores = useMemo(() => {
    return items.map((p) => {
      const contentCombined = [
        p.description || "",
        p.challenge || "",
        p.solution || "",
        ...(p.results || []),
        ...(p.process || []),
        ...(p.keyFeatures || []),
      ].join(" ");

      const seo = calculateSeoScore({
        title: p.title,
        slug: `work/${p.slug || p.id}`,
        seoTitle: p.seoTitle,
        metaDescription: p.metaDescription,
        focusKeyword: p.focusKeyword,
        content: contentCombined,
        featuredImage: p.image,
        featuredImageAlt: p.imageAlt,
        robotsIndex: p.robotsIndex !== undefined ? p.robotsIndex : true,
      });

      return {
        ...p,
        seoScore: seo.score,
        seoGrade: seo.grade,
      };
    });
  }, [items]);

  // Distinct Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return itemsWithScores
      .filter((p) => {
        if (statusFilter !== "all" && (p.status || "published") !== statusFilter) return false;
        if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
        if (featuredFilter === "featured" && !p.featured) return false;
        if (featuredFilter === "not_featured" && p.featured) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchSlug = (p.slug || p.id).toLowerCase().includes(q);
          const matchClient = p.client.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchTech = Array.isArray(p.technologies) && p.technologies.some((t) => t.toLowerCase().includes(q));
          const matchKeyword = p.focusKeyword?.toLowerCase().includes(q);

          if (!matchTitle && !matchSlug && !matchClient && !matchCategory && !matchTech && !matchKeyword) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "updated") {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === "newest") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === "oldest") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "client") {
          return a.client.localeCompare(b.client);
        }
        if (sortBy === "seo") {
          return b.seoScore - a.seoScore;
        }
        return 0;
      });
  }, [itemsWithScores, statusFilter, categoryFilter, featuredFilter, searchQuery, sortBy]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = itemsWithScores.length;
    const published = itemsWithScores.filter((p) => (p.status || "published") === "published").length;
    const drafts = itemsWithScores.filter((p) => p.status === "draft").length;
    const featured = itemsWithScores.filter((p) => p.featured).length;
    const avgScore =
      total > 0 ? Math.round(itemsWithScores.reduce((acc, p) => acc + p.seoScore, 0) / total) : 0;
    return { total, published, drafts, featured, avgScore };
  }, [itemsWithScores]);

  if (authLoading) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Top Navbar */}
      <nav className="border-b border-[#1EDAC6]/20 bg-surface-raised sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="p-1.5 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white transition-colors"
              title="Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-white text-base leading-tight">
                Portfolio CMS & SEO Center
              </h1>
              <p className="text-[11px] text-gray-400">
                Manage client case studies, structured outcomes & SEO metadata
              </p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/portfolio/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(30,218,198,0.25)]"
          >
            <Plus className="w-4 h-4" /> Add Project
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Total Projects</span>
              <Briefcase className="w-4 h-4 text-[#1EDAC6]" />
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

        {/* Filter, Search & Sort Control Panel */}
        <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="sm:col-span-4 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, client, slug, tech, keyword..."
                className="w-full pl-9 pr-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
              />
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
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div className="sm:col-span-1">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-2.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
              >
                <option value="all">All</option>
                <option value="featured">★ Starred</option>
                <option value="not_featured">Regular</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
              >
                <option value="updated">Recently Updated</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="seo">SEO Score (High-Low)</option>
                <option value="title">Project (A-Z)</option>
                <option value="client">Client (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* High Density Portfolio Table */}
        <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-xs">Loading portfolio items…</div>
          ) : filteredItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-gray-400 text-sm">No portfolio items found matching your filters.</p>
              <Link
                href="/admin/dashboard/portfolio/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1EDAC6] text-black text-xs font-semibold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Create First Project
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface border-b border-[#1EDAC6]/10 text-gray-400 font-medium">
                    <th className="px-5 py-3.5">Project Title & Slug</th>
                    <th className="px-4 py-3.5">Client & Category</th>
                    <th className="px-4 py-3.5">Tech Stack</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">SEO Health</th>
                    <th className="px-4 py-3.5">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1EDAC6]/10">
                  {filteredItems.map((item) => {
                    const isPublished = (item.status || "published") === "published";
                    const isDraft = item.status === "draft";
                    const displaySlug = item.slug || item.id;

                    const scoreColor =
                      item.seoScore >= 85
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : item.seoScore >= 70
                        ? "text-[#1EDAC6] bg-[#1EDAC6]/10 border-[#1EDAC6]/30"
                        : item.seoScore >= 50
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30";

                    return (
                      <tr
                        key={item.id}
                        className="bg-card hover:bg-card-hover transition-colors group"
                      >
                        {/* Title & Slug */}
                        <td className="px-5 py-4 max-w-xs">
                          <div className="font-semibold text-white text-sm truncate group-hover:text-[#1EDAC6] transition-colors">
                            <Link href={`/admin/dashboard/portfolio/${item.id}`}>
                              {item.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 font-mono text-[11px] truncate">
                            <span>/work/{displaySlug}</span>
                            <a
                              href={`/work/${displaySlug}?preview=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-[#1EDAC6] transition-colors"
                              title="Preview live case study"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>

                        {/* Client & Category */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-medium text-white block text-xs">
                            {item.client}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1EDAC6]/10 text-[#1EDAC6] border border-[#1EDAC6]/20 inline-block mt-0.5">
                            {item.category}
                          </span>
                        </td>

                        {/* Technologies */}
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[170px]">
                            {(item.technologies || []).slice(0, 2).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] text-gray-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 whitespace-nowrap"
                              >
                                {t}
                              </span>
                            ))}
                            {(item.technologies || []).length > 2 && (
                              <span className="text-[10px] text-gray-500">
                                +{(item.technologies || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(item)}
                            disabled={togglingId === item.id}
                            title="Click to toggle publish status"
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                              isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : isDraft
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                            }`}
                          >
                            {togglingId === item.id ? "Updating…" : item.status || "published"}
                          </button>
                        </td>

                        {/* SEO Health Score */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 w-fit ${scoreColor}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.seoScore >= 85
                                  ? "bg-emerald-400"
                                  : item.seoScore >= 70
                                  ? "bg-[#1EDAC6]"
                                  : item.seoScore >= 50
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                            />
                            {item.seoScore} / 100
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          {item.featured ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                              <Star className="w-3.5 h-3.5 fill-current" /> Featured
                            </span>
                          ) : (
                            <span className="text-gray-500 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/portfolio/${item.id}`}
                              className="p-1.5 rounded-md hover:bg-[#1EDAC6]/10 text-[#1EDAC6] transition-colors"
                              title="Edit Project CMS"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>

                            <a
                              href={`/work/${displaySlug}?preview=true`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 transition-colors"
                              title="Preview Case Study"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDuplicate(item)}
                              disabled={duplicatingId === item.id}
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 transition-colors disabled:opacity-50"
                              title="Duplicate Project as Draft"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400 transition-colors"
                              title="Delete Project"
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

      {/* Delete Confirmation Modal with 301 Redirect Handling */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" /> Confirm Project Deletion
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">&quot;{deleteTarget.title}&quot;</strong> (/work/{deleteTarget.slug || deleteTarget.id})?
            </p>

            <div className="p-3.5 rounded-xl bg-card border border-white/10 space-y-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer text-gray-200">
                <input
                  type="checkbox"
                  checked={createRedirectOnDelete}
                  onChange={(e) => setCreateRedirectOnDelete(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded mt-0.5"
                />
                <span>
                  Create a 301 Permanent Redirect to prevent 404 crawl errors for search engines
                </span>
              </label>

              {createRedirectOnDelete && (
                <div className="pt-2">
                  <label className="block text-[11px] text-gray-400 mb-1">
                    Redirect Destination URL
                  </label>
                  <input
                    type="text"
                    value={deleteRedirectTarget}
                    onChange={(e) => setDeleteRedirectTarget(e.target.value)}
                    placeholder="/work"
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
                {deleting ? "Deleting…" : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
