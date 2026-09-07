"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Save,
  Globe,
  Eye,
  Calendar,
  Sparkles,
  Share2,
  Settings,
  HelpCircle,
  FileText,
  Clock,
  History,
  AlertTriangle,
  Upload,
  X,
  Plus,
  Lock,
  Tag,
  Bookmark,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { BlogPost, PageStatus, FAQItem } from "@/types";
import { RichTextEditor } from "@/components/admin/pages/RichTextEditor";
import { SeoScoreCard } from "@/components/admin/pages/SeoScoreCard";
import { GooglePreview } from "@/components/admin/pages/GooglePreview";
import { SocialPreview } from "@/components/admin/pages/SocialPreview";
import { FaqManager } from "@/components/admin/pages/FaqManager";
import { VersionHistoryModal } from "@/components/admin/pages/VersionHistoryModal";

const CATEGORIES = [
  "AI & Machine Learning",
  "Web Development",
  "Mobile Apps",
  "Cloud & DevOps",
  "SEO & Growth",
  "UI/UX Design",
  "Technology Insights",
  "Custom Software",
];

interface BlogPostEditorProps {
  initialPost?: Partial<BlogPost>;
  isNew?: boolean;
}

export function BlogPostEditor({ initialPost, isNew = false }: BlogPostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [activeTab, setActiveTab] = useState<"seo" | "social" | "media" | "advanced">("seo");
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialPost?.title || "");
  const [slug, setSlug] = useState(initialPost?.slug || "");
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialPost?.slug));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [author, setAuthor] = useState(initialPost?.author || "Glovax Team");
  const [category, setCategory] = useState(initialPost?.category || "AI & Machine Learning");
  const [tags, setTags] = useState<string[]>(initialPost?.tags || ["AI", "Web Development"]);
  const [newTagInput, setNewTagInput] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    initialPost?.publishedAt || new Date().toISOString().slice(0, 10)
  );
  const [readTime, setReadTime] = useState<number>(initialPost?.readTime || 5);
  const [featured, setFeatured] = useState(Boolean(initialPost?.featured));
  const [status, setStatus] = useState<PageStatus>(initialPost?.status || "published");

  // SEO & Media State
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPost?.featuredImageAlt || "");
  const [featuredImageTitle, setFeaturedImageTitle] = useState(initialPost?.featuredImageTitle || "");
  const [featuredImageCaption, setFeaturedImageCaption] = useState(initialPost?.featuredImageCaption || "");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialPost?.focusKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(initialPost?.secondaryKeywords || []);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState(initialPost?.canonicalUrl || "");
  const [robotsIndex, setRobotsIndex] = useState(initialPost?.robotsIndex !== undefined ? initialPost.robotsIndex : true);
  const [robotsFollow, setRobotsFollow] = useState(initialPost?.robotsFollow !== undefined ? initialPost.robotsFollow : true);
  const [ogTitle, setOgTitle] = useState(initialPost?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initialPost?.ogDescription || "");
  const [ogImage, setOgImage] = useState(initialPost?.ogImage || "");
  const [ogImageAlt, setOgImageAlt] = useState(initialPost?.ogImageAlt || "");
  const [twitterTitle, setTwitterTitle] = useState(initialPost?.twitterTitle || "");
  const [twitterDescription, setTwitterDescription] = useState(initialPost?.twitterDescription || "");
  const [twitterImage, setTwitterImage] = useState(initialPost?.twitterImage || "");
  const [faqs, setFaqs] = useState<FAQItem[]>(initialPost?.faqs || []);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

  // 301 Redirect detection
  const originalSlugRef = useRef<string>(initialPost?.slug || "");
  const [createRedirectOnSlugChange, setCreateRedirectOnSlugChange] = useState(true);

  // Auto-generate slug from title if not customized
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSaveStatus("unsaved");
    if (!isCustomSlug || !slug) {
      setSlug(cleanSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setIsCustomSlug(true);
    setSlug(cleanSlug(val));
    setSaveStatus("unsaved");
  };

  // Tags management
  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
    setSaveStatus("unsaved");
  };

  // Secondary Keywords management
  const handleAddKeyword = () => {
    const trimmed = newKeywordInput.trim().toLowerCase();
    if (trimmed && !secondaryKeywords.includes(trimmed)) {
      setSecondaryKeywords([...secondaryKeywords, trimmed]);
      setNewKeywordInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setSecondaryKeywords(secondaryKeywords.filter((k) => k !== kw));
    setSaveStatus("unsaved");
  };

  // Image upload
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFeaturedImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setFeaturedImage(data.url);
        if (!ogImage) setOgImage(data.url);
        if (!featuredImageAlt) {
          const autoName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setFeaturedImageAlt(autoName);
        }
        setSaveStatus("unsaved");
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Failed to upload image");
    }
    setUploadingFeaturedImage(false);
  };

  // Auto calculate reading time
  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, " ").trim();
    const words = plainText.split(/\s+/).filter(Boolean).length;
    const calculated = Math.max(1, Math.ceil(words / 220));
    setReadTime(calculated);
  }, [content]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  const slugValidation = validateSlug(slug);
  const publicUrl = `${siteConfig.url}/blog/${slug}`;

  // Save handler
  const handleSave = async (overrideStatus?: PageStatus) => {
    if (!title.trim()) {
      alert("Please enter a Post Title.");
      return;
    }

    if (!slugValidation.valid) {
      alert(slugValidation.error);
      return;
    }

    const currentStatus = overrideStatus || status;
    setSaving(true);
    setSaveStatus("saving");

    const payload = {
      title: title.trim(),
      slug: cleanSlug(slug),
      excerpt: excerpt.trim(),
      content,
      author: author.trim() || "Glovax Team",
      category,
      tags,
      publishedAt,
      readTime,
      featured,
      featuredImage: featuredImage.trim() || null,
      featuredImageAlt: featuredImageAlt.trim() || null,
      featuredImageTitle: featuredImageTitle.trim() || null,
      featuredImageCaption: featuredImageCaption.trim() || null,
      seoTitle: seoTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      focusKeyword: focusKeyword.trim() || null,
      secondaryKeywords,
      canonicalUrl: canonicalUrl.trim() || null,
      robotsIndex,
      robotsFollow,
      ogTitle: ogTitle.trim() || null,
      ogDescription: ogDescription.trim() || null,
      ogImage: ogImage.trim() || null,
      ogImageAlt: ogImageAlt.trim() || null,
      twitterTitle: twitterTitle.trim() || null,
      twitterDescription: twitterDescription.trim() || null,
      twitterImage: twitterImage.trim() || null,
      faqs,
      status: currentStatus,
      createRedirect:
        !isNew &&
        originalSlugRef.current &&
        originalSlugRef.current !== cleanSlug(slug) &&
        createRedirectOnSlugChange,
    };

    try {
      const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${initialPost?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setSaveStatus("saved");
        originalSlugRef.current = cleanSlug(slug);
        if (overrideStatus) setStatus(overrideStatus);

        if (isNew && data.post?.id) {
          router.push(`/admin/dashboard/blog/${data.post.id}`);
        }
      } else {
        alert(data.error || "Failed to save article");
        setSaveStatus("unsaved");
      }
    } catch {
      alert("Network error while saving article");
      setSaveStatus("unsaved");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Top Fixed Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-surface-raised/90 backdrop-blur-md border-b border-[#1EDAC6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <Link
              href="/admin/dashboard/blog"
              className="p-1.5 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white transition-colors"
              title="Back to Blog posts"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Blog /</span>
                <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                  {title || (isNew ? "New Article" : "Edit Article")}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full border ${
                    status === "published"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : status === "scheduled"
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[11px] text-gray-400 hidden sm:inline-block mr-1">
              {saveStatus === "saving" ? (
                <span className="text-[#1EDAC6] animate-pulse">Saving…</span>
              ) : saveStatus === "unsaved" ? (
                <span className="text-amber-400">● Unsaved</span>
              ) : (
                <span className="text-emerald-400">✓ Saved</span>
              )}
            </span>

            {/* Live Preview Button */}
            <a
              href={`/blog/${slug || "preview"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-card-hover border border-[#1EDAC6]/20 text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#1EDAC6]" />
              <span className="hidden sm:inline">Preview</span>
            </a>

            {/* Save Draft */}
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="px-3.5 py-1.5 bg-card hover:bg-card-hover border border-white/15 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>

            {/* Publish / Update */}
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(30,218,198,0.3)]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saving
                  ? "Saving…"
                  : status === "published"
                  ? "Update Article"
                  : "Publish Article"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Article Content & Structure (7 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Article Basic Info Card */}
            <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#1EDAC6]/10 pb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1EDAC6]" /> Article Information & Taxonomy
                </h2>
                <span className="text-[11px] text-gray-500 font-mono">
                  ID: {initialPost?.id || "auto"}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Article Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. AI-Powered SEO Tactics That Dominate Search in 2026"
                  required
                  className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/25 rounded-lg text-white text-base font-semibold focus:outline-none focus:border-[#1EDAC6] focus:ring-1 focus:ring-[#1EDAC6]"
                />
              </div>

              {/* URL Slug & Live Domain Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-300">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  {!slugValidation.valid ? (
                    <span className="text-[11px] text-red-400">{slugValidation.error}</span>
                  ) : (
                    <span className="text-[11px] text-emerald-400">Valid article URL</span>
                  )}
                </div>

                <div className="flex rounded-lg overflow-hidden border border-[#1EDAC6]/20 bg-card">
                  <span className="px-3 py-2 bg-surface text-gray-400 text-xs font-mono border-r border-[#1EDAC6]/10 select-none flex items-center">
                    {siteConfig.url.replace(/^https?:\/\//, "")}/blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="ai-powered-seo-tactics-2026"
                    required
                    className="flex-1 px-3 py-2 bg-transparent text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                {/* Slug Change 301 Redirect Prompt */}
                {!isNew && originalSlugRef.current && originalSlugRef.current !== slug && (
                  <div className="mt-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div className="flex-1">
                      <p className="font-medium">URL Slug changed from &quot;/blog/{originalSlugRef.current}&quot; to &quot;/blog/{slug}&quot;.</p>
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-gray-200">
                        <input
                          type="checkbox"
                          checked={createRedirectOnSlugChange}
                          onChange={(e) => setCreateRedirectOnSlugChange(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                        />
                        <span>Create permanent 301 redirect from /blog/{originalSlugRef.current} to /blog/{slug} (Preserves backlink juice)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Category & Author Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => {
                      setAuthor(e.target.value);
                      setSaveStatus("unsaved");
                    }}
                    placeholder="Glovax Team"
                    className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                  />
                </div>
              </div>

              {/* Tags Manager */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1EDAC6]" /> Article Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Enter or click Add"
                    className="flex-1 px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-[#1EDAC6]/10 hover:bg-[#1EDAC6]/20 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-card border border-[#1EDAC6]/20 text-gray-300"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Excerpt / Summary */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Article Summary / Excerpt
                  </label>
                  <span
                    className={`text-[11px] ${
                      excerpt.length >= 130 && excerpt.length <= 200
                        ? "text-emerald-400"
                        : "text-gray-400"
                    }`}
                  >
                    {excerpt.length} / 200 chars (130–200 optimal)
                  </span>
                </div>
                <textarea
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="Key summary of this article shown on blog cards and search listings..."
                  rows={2}
                  className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6] resize-none"
                />
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1EDAC6]" /> Article Body & Semantic Layout
                </h2>
                <span className="text-xs text-gray-400">
                  {content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length} words · ~{readTime} min read
                </span>
              </div>

              <RichTextEditor
                value={content}
                onChange={(html) => {
                  setContent(html);
                  setSaveStatus("unsaved");
                }}
                focusKeyword={focusKeyword}
                placeholder="Write comprehensive, authoritative content with H2 headings, bullet points, data tables, and code snippets..."
              />
            </div>

            {/* FAQ Manager Section */}
            <FaqManager
              faqs={faqs}
              onChange={(updatedFaqs) => {
                setFaqs(updatedFaqs);
                setSaveStatus("unsaved");
              }}
            />
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: SEO Suite, Social, Media & Publishing (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-6">
            {/* Publishing Box */}
            <div className="bg-surface-raised border border-[#1EDAC6]/20 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#1EDAC6]/10 pb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1EDAC6]" /> Publishing & Status
                </h3>
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(true)}
                  className="text-xs text-gray-400 hover:text-[#1EDAC6] flex items-center gap-1 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>v{initialPost?.versionHistory?.length ? initialPost.versionHistory.length : 1}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value as PageStatus);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-[#1EDAC6]"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Publish Date</label>
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => {
                        setPublishedAt(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>
                </div>

                {/* Featured Post Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card/60 border border-white/5">
                  <div>
                    <span className="text-xs font-medium text-white block">Featured Article</span>
                    <span className="text-[10px] text-gray-400">Pinned to top of blog listing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => {
                      setFeatured(e.target.checked);
                      setSaveStatus("unsaved");
                    }}
                    className="w-4 h-4 accent-[#1EDAC6] rounded"
                  />
                </div>
              </div>
            </div>

            {/* Real-time SEO Score Audit Card */}
            <SeoScoreCard
              title={title}
              slug={`blog/${slug}`}
              seoTitle={seoTitle}
              metaDescription={metaDescription}
              focusKeyword={focusKeyword}
              content={content}
              featuredImage={featuredImage}
              featuredImageAlt={featuredImageAlt}
              robotsIndex={robotsIndex}
            />

            {/* Live Google Search Preview */}
            <GooglePreview
              title={title}
              slug={`blog/${slug}`}
              seoTitle={seoTitle}
              metaDescription={metaDescription}
            />

            {/* Tabs for Detailed SEO Controls */}
            <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl overflow-hidden shadow-lg">
              {/* Tab Navigation */}
              <div className="flex border-b border-[#1EDAC6]/10 bg-card">
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === "seo"
                      ? "border-b-2 border-[#1EDAC6] text-[#1EDAC6] bg-surface-raised"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> SEO
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("social")}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === "social"
                      ? "border-b-2 border-[#1EDAC6] text-[#1EDAC6] bg-surface-raised"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" /> Social
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === "media"
                      ? "border-b-2 border-[#1EDAC6] text-[#1EDAC6] bg-surface-raised"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> Media
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("advanced")}
                  className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === "advanced"
                      ? "border-b-2 border-[#1EDAC6] text-[#1EDAC6] bg-surface-raised"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" /> Advanced
                </button>
              </div>

              {/* Tab 1: SEO */}
              {activeTab === "seo" && (
                <div className="p-5 space-y-4">
                  {/* SEO Title */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-300">
                        SEO Title / Meta Title
                      </label>
                      <span
                        className={`text-[11px] ${
                          (seoTitle || title).length >= 50 && (seoTitle || title).length <= 60
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      >
                        {(seoTitle || title).length} / 60 chars (50–60 optimal)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => {
                        setSeoTitle(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={title ? `${title} | Glovax Technologies` : "Article SEO Title"}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-300">
                        Meta Description
                      </label>
                      <span
                        className={`text-[11px] ${
                          metaDescription.length >= 140 && metaDescription.length <= 160
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }`}
                      >
                        {metaDescription.length} / 160 chars (140–160 optimal)
                      </span>
                    </div>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => {
                        setMetaDescription(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="Comprehensive article overview optimized for search snippets..."
                      rows={3}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6] resize-none"
                    />
                  </div>

                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#1EDAC6]" /> Primary Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => {
                        setFocusKeyword(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. AI SEO tactics"
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Secondary Keywords */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Secondary Keywords
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="e.g. search engine optimization, rank higher"
                        className="flex-1 px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-1.5 bg-[#1EDAC6]/10 hover:bg-[#1EDAC6]/20 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {secondaryKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {secondaryKeywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-card border border-[#1EDAC6]/20 text-gray-300"
                          >
                            <span>{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(kw)}
                              className="text-gray-500 hover:text-red-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Social Media */}
              {activeTab === "social" && (
                <div className="p-5 space-y-4">
                  <SocialPreview
                    title={title}
                    seoTitle={seoTitle}
                    metaDescription={metaDescription}
                    ogTitle={ogTitle}
                    ogDescription={ogDescription}
                    ogImage={ogImage || featuredImage}
                    twitterTitle={twitterTitle}
                    twitterDescription={twitterDescription}
                    twitterImage={twitterImage || featuredImage}
                  />

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">OpenGraph Title</label>
                      <input
                        type="text"
                        value={ogTitle}
                        onChange={(e) => {
                          setOgTitle(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder={seoTitle || title || "Custom social sharing title"}
                        className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">OpenGraph Description</label>
                      <textarea
                        value={ogDescription}
                        onChange={(e) => {
                          setOgDescription(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder={metaDescription || "Social sharing description..."}
                        rows={2}
                        className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Social Image URL (1200 × 630px)</label>
                      <input
                        type="text"
                        value={ogImage}
                        onChange={(e) => {
                          setOgImage(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="/images/glovax-og.png or https://..."
                        className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Media & Featured Image */}
              {activeTab === "media" && (
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Featured Cover Image
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={featuredImage}
                        onChange={(e) => {
                          setFeaturedImage(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="/images/blog/article.webp or upload"
                        className="flex-1 px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                      />
                      <label className="px-3 py-2 bg-card border border-[#1EDAC6]/30 hover:border-[#1EDAC6] text-[#1EDAC6] rounded-lg text-xs cursor-pointer flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingFeaturedImage ? "Uploading…" : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {featuredImage && (
                      <div className="rounded-xl overflow-hidden border border-[#1EDAC6]/20 w-full relative aspect-[16/9] bg-black/40 mb-3">
                        <Image
                          src={featuredImage.startsWith("/") || featuredImage.startsWith("http") || featuredImage.startsWith("data:") ? featuredImage : `/${featuredImage}`}
                          alt={featuredImageAlt || "Preview"}
                          fill
                          sizes="400px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Featured Image Alt Text <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={featuredImageAlt}
                      onChange={(e) => {
                        setFeaturedImageAlt(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. AI SEO tactics workflow graph"
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Technical & Advanced SEO */}
              {activeTab === "advanced" && (
                <div className="p-5 space-y-4">
                  {/* Canonical URL */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Canonical URL Override
                    </label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => {
                        setCanonicalUrl(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={publicUrl}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Robots Directives */}
                  <div className="p-3 bg-card rounded-lg border border-white/5 space-y-2">
                    <span className="text-xs font-semibold text-white block">Robots Directives</span>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={robotsIndex}
                          onChange={(e) => {
                            setRobotsIndex(e.target.checked);
                            setSaveStatus("unsaved");
                          }}
                          className="w-4 h-4 accent-[#1EDAC6] rounded"
                        />
                        <span>Allow Search Engines (Index)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={robotsFollow}
                          onChange={(e) => {
                            setRobotsFollow(e.target.checked);
                            setSaveStatus("unsaved");
                          }}
                          className="w-4 h-4 accent-[#1EDAC6] rounded"
                        />
                        <span>Follow Links (Follow)</span>
                      </label>
                    </div>

                    {!robotsIndex && (
                      <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-[11px] text-red-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>Warning: Search engines will not index this blog post.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        versions={initialPost?.versionHistory}
        pageTitle={title || "Article"}
      />
    </div>
  );
}
