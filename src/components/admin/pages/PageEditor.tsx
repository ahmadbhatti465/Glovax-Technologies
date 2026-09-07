"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { Page, PageType, PageStatus, SchemaType, FAQItem } from "@/types";
import { RichTextEditor } from "./RichTextEditor";
import { SeoScoreCard } from "./SeoScoreCard";
import { GooglePreview } from "./GooglePreview";
import { SocialPreview } from "./SocialPreview";
import { FaqManager } from "./FaqManager";
import { VersionHistoryModal } from "./VersionHistoryModal";

interface PageEditorProps {
  initialPage?: Partial<Page>;
  isNew?: boolean;
}

export function PageEditor({ initialPage, isNew = false }: PageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [activeTab, setActiveTab] = useState<"seo" | "social" | "media" | "advanced">("seo");
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialPage?.title || "");
  const [slug, setSlug] = useState(initialPage?.slug || "");
  const [isCustomSlug, setIsCustomSlug] = useState(Boolean(initialPage?.slug));
  const [excerpt, setExcerpt] = useState(initialPage?.excerpt || "");
  const [content, setContent] = useState(initialPage?.content || "");
  const [pageType, setPageType] = useState<PageType>(initialPage?.pageType || "standard");
  const [featuredImage, setFeaturedImage] = useState(initialPage?.featuredImage || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPage?.featuredImageAlt || "");
  const [featuredImageTitle, setFeaturedImageTitle] = useState(initialPage?.featuredImageTitle || "");
  const [featuredImageCaption, setFeaturedImageCaption] = useState(initialPage?.featuredImageCaption || "");
  const [seoTitle, setSeoTitle] = useState(initialPage?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialPage?.metaDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialPage?.focusKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(initialPage?.secondaryKeywords || []);
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState(initialPage?.canonicalUrl || "");
  const [robotsIndex, setRobotsIndex] = useState(initialPage?.robotsIndex !== undefined ? initialPage.robotsIndex : true);
  const [robotsFollow, setRobotsFollow] = useState(initialPage?.robotsFollow !== undefined ? initialPage.robotsFollow : true);
  const [includeInSitemap, setIncludeInSitemap] = useState(initialPage?.includeInSitemap !== undefined ? initialPage.includeInSitemap : true);
  const [sitemapPriority, setSitemapPriority] = useState<number>(initialPage?.sitemapPriority ?? 0.8);
  const [changeFrequency, setChangeFrequency] = useState(initialPage?.changeFrequency || "monthly");
  const [ogTitle, setOgTitle] = useState(initialPage?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initialPage?.ogDescription || "");
  const [ogImage, setOgImage] = useState(initialPage?.ogImage || "");
  const [ogImageAlt, setOgImageAlt] = useState(initialPage?.ogImageAlt || "");
  const [twitterTitle, setTwitterTitle] = useState(initialPage?.twitterTitle || "");
  const [twitterDescription, setTwitterDescription] = useState(initialPage?.twitterDescription || "");
  const [twitterImage, setTwitterImage] = useState(initialPage?.twitterImage || "");
  const [schemaType, setSchemaType] = useState<SchemaType>(initialPage?.schemaType || "WebPage");
  const [faqs, setFaqs] = useState<FAQItem[]>(initialPage?.faqs || []);
  const [status, setStatus] = useState<PageStatus>(initialPage?.status || "draft");
  const [author, setAuthor] = useState(initialPage?.author || "Glovax Team");
  const [featured, setFeatured] = useState(Boolean(initialPage?.featured));
  const [scheduledAt, setScheduledAt] = useState<string>(
    initialPage?.scheduledAt ? new Date(initialPage.scheduledAt).toISOString().slice(0, 16) : ""
  );

  // 301 Redirect detection
  const originalSlugRef = useRef<string>(initialPage?.slug || "");
  const [createRedirectOnSlugChange, setCreateRedirectOnSlugChange] = useState(true);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);

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

  // Add secondary keyword
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

  // Featured Image file upload
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

  // Validation
  const slugValidation = validateSlug(slug);

  // Save handler
  const handleSave = async (overrideStatus?: PageStatus) => {
    if (!title.trim()) {
      alert("Please enter a Page Title.");
      return;
    }

    if (!slugValidation.valid) {
      alert(slugValidation.error);
      return;
    }

    const currentStatus = overrideStatus || status;
    setSaving(true);
    setSaveStatus("saving");

    const plainText = content.replace(/<[^>]*>/g, " ").trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 220));

    const payload = {
      title: title.trim(),
      slug: cleanSlug(slug),
      excerpt: excerpt.trim(),
      content,
      pageType,
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
      includeInSitemap,
      sitemapPriority: Number(sitemapPriority) || 0.8,
      changeFrequency,
      ogTitle: ogTitle.trim() || null,
      ogDescription: ogDescription.trim() || null,
      ogImage: ogImage.trim() || null,
      ogImageAlt: ogImageAlt.trim() || null,
      twitterTitle: twitterTitle.trim() || null,
      twitterDescription: twitterDescription.trim() || null,
      twitterImage: twitterImage.trim() || null,
      schemaType,
      faqs,
      status: currentStatus,
      author: author.trim() || "Glovax Team",
      featured,
      readTime,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      createRedirect: !isNew && originalSlugRef.current && originalSlugRef.current !== cleanSlug(slug) && createRedirectOnSlugChange,
    };

    try {
      const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${initialPage?.id}`;
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

        if (isNew && data.page?.id) {
          router.push(`/admin/dashboard/pages/${data.page.id}`);
        }
      } else {
        alert(data.error || "Failed to save page");
        setSaveStatus("unsaved");
      }
    } catch {
      alert("Network error while saving page");
      setSaveStatus("unsaved");
    }
    setSaving(false);
  };

  // Live URL
  const publicUrl = `${siteConfig.url}/${slug}`;

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Top Fixed Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-surface-raised/90 backdrop-blur-md border-b border-[#1EDAC6]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 truncate">
            <Link
              href="/admin/dashboard/pages"
              className="p-1.5 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white transition-colors"
              title="Back to Pages list"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Pages /</span>
                <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                  {title || (isNew ? "New Page" : "Edit Page")}
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
            {/* Save Status Indicator */}
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
              href={`/${slug || "preview"}?preview=true`}
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

            {/* Publish / Schedule / Update */}
            <button
              type="button"
              onClick={() => handleSave(status === "scheduled" ? "scheduled" : "published")}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(30,218,198,0.3)]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saving
                  ? "Saving…"
                  : status === "published"
                  ? "Update Page"
                  : status === "scheduled"
                  ? "Schedule"
                  : "Publish"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ======================================================== */}
          {/* LEFT COLUMN: Main Content & Structural Page Builder (7 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Page Information Card */}
            <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#1EDAC6]/10 pb-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1EDAC6]" /> General Page Information
                </h2>
                <span className="text-[11px] text-gray-500 font-mono">
                  ID: {initialPage?.id || "auto"}
                </span>
              </div>

              {/* Page Title */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Page Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Professional Custom Web Development Services"
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
                    <span className="text-[11px] text-emerald-400">Valid URL path</span>
                  )}
                </div>

                <div className="flex rounded-lg overflow-hidden border border-[#1EDAC6]/20 bg-card">
                  <span className="px-3 py-2 bg-surface text-gray-400 text-xs font-mono border-r border-[#1EDAC6]/10 select-none flex items-center">
                    {siteConfig.url.replace(/^https?:\/\//, "")}/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="web-development-services"
                    required
                    className="flex-1 px-3 py-2 bg-transparent text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                {/* Slug Change 301 Redirect Prompt */}
                {!isNew && originalSlugRef.current && originalSlugRef.current !== slug && (
                  <div className="mt-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div className="flex-1">
                      <p className="font-medium">URL Slug has changed from &quot;/{originalSlugRef.current}&quot; to &quot;/{slug}&quot;.</p>
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-gray-200">
                        <input
                          type="checkbox"
                          checked={createRedirectOnSlugChange}
                          onChange={(e) => setCreateRedirectOnSlugChange(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                        />
                        <span>Create permanent 301 redirect from /{originalSlugRef.current} to /{slug} (Recommended for SEO)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Type & Excerpt Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Page Type
                  </label>
                  <select
                    value={pageType}
                    onChange={(e) => {
                      setPageType(e.target.value as PageType);
                      setSaveStatus("unsaved");
                      // Auto-suggest schema
                      if (e.target.value === "service") setSchemaType("Service");
                      else if (e.target.value === "contact") setSchemaType("ContactPage");
                      else if (e.target.value === "company") setSchemaType("AboutPage");
                    }}
                    className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                  >
                    <option value="standard">Standard Page</option>
                    <option value="service">Service Page</option>
                    <option value="landing">Landing Page</option>
                    <option value="portfolio">Portfolio Page</option>
                    <option value="case_study">Case Study</option>
                    <option value="company">Company Page</option>
                    <option value="contact">Contact Page</option>
                    <option value="policy">Policy Page</option>
                    <option value="custom">Custom Page</option>
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

              {/* Excerpt / Summary */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-gray-300">
                    Page Excerpt / Summary
                  </label>
                  <span
                    className={`text-[11px] ${
                      excerpt.length >= 150 && excerpt.length <= 300
                        ? "text-emerald-400"
                        : "text-gray-400"
                    }`}
                  >
                    {excerpt.length} / 300 chars (150–300 optimal)
                  </span>
                </div>
                <textarea
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    setSaveStatus("unsaved");
                  }}
                  placeholder="A concise summary of this page used for internal card previews and related links..."
                  rows={2}
                  className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6] resize-none"
                />
              </div>
            </div>

            {/* Page Content Editor Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1EDAC6]" /> Page Content & Semantic Layout
                </h2>
                <span className="text-xs text-gray-400">
                  {content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <RichTextEditor
                value={content}
                onChange={(html) => {
                  setContent(html);
                  setSaveStatus("unsaved");
                }}
                focusKeyword={focusKeyword}
                placeholder="Write in-depth content with H2 headings, bullet points, interactive tables, and code snippets..."
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
          {/* RIGHT COLUMN: SEO Suite, Social, Media & Advanced Controls (5 Cols) */}
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
                  <span>v{initialPage?.versionHistory?.length ? initialPage.versionHistory.length : 1}</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* Status Dropdown */}
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
                    <option value="draft">Draft (Private, not indexable)</option>
                    <option value="published">Published (Public & Indexable)</option>
                    <option value="scheduled">Scheduled (Publish automatically)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {/* Scheduled Date Picker */}
                {status === "scheduled" && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1EDAC6]" /> Scheduled Publish Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => {
                        setScheduledAt(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>
                )}

                {/* Featured Page Switch */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-card/60 border border-white/5">
                  <div>
                    <span className="text-xs font-medium text-white block">Featured Page</span>
                    <span className="text-[10px] text-gray-400">Highlighted in navigation & footer</span>
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
              slug={slug}
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
              slug={slug}
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
                      placeholder={title ? `${title} | Glovax Technologies` : "Professional Web Development | Glovax Technologies"}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      If left empty, falls back to Page Title automatically.
                    </span>
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
                      placeholder="Glovax Technologies provides high-performance custom software, mobile app, and AI development services designed to scale your business..."
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
                      placeholder="e.g. web development company"
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
                        placeholder="e.g. custom software, SaaS development"
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
                      Featured Image
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={featuredImage}
                        onChange={(e) => {
                          setFeaturedImage(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="/images/portfolio/project.webp or upload"
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

                    {/* Image Preview Box */}
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
                      placeholder="e.g. Glovax Technologies enterprise web application dashboard"
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Accurate descriptive alt text improves ranking in Google Images & aids screen readers.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Image Title Attribute
                    </label>
                    <input
                      type="text"
                      value={featuredImageTitle}
                      onChange={(e) => {
                        setFeaturedImageTitle(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="Hover tooltip label"
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
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Defaults to {publicUrl} automatically if left empty.
                    </span>
                  </div>

                  {/* Schema Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Structured Data Schema Type
                    </label>
                    <select
                      value={schemaType}
                      onChange={(e) => {
                        setSchemaType(e.target.value as SchemaType);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-xs focus:outline-none focus:border-[#1EDAC6]"
                    >
                      <option value="WebPage">WebPage (General)</option>
                      <option value="Service">Service (Software / Tech Services)</option>
                      <option value="AboutPage">AboutPage (Company Info)</option>
                      <option value="ContactPage">ContactPage (Contact Info)</option>
                      <option value="FAQPage">FAQPage (Q&A Accordions)</option>
                      <option value="SoftwareApplication">SoftwareApplication (SaaS / Products)</option>
                      <option value="Organization">Organization</option>
                      <option value="BreadcrumbList">BreadcrumbList</option>
                      <option value="None">None</option>
                    </select>
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
                        <span>Warning: Search engines will NOT index this page (noindex directive).</span>
                      </div>
                    )}
                  </div>

                  {/* XML Sitemap Directives */}
                  <div className="p-3 bg-card rounded-lg border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">XML Sitemap</span>
                        <span className="text-[10px] text-gray-400">Include in /sitemap.xml automatically</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={includeInSitemap}
                        onChange={(e) => {
                          setIncludeInSitemap(e.target.checked);
                          setSaveStatus("unsaved");
                        }}
                        className="w-4 h-4 accent-[#1EDAC6] rounded"
                      />
                    </div>

                    {includeInSitemap && (
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1">
                            Sitemap Priority ({sitemapPriority})
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            value={sitemapPriority}
                            onChange={(e) => {
                              setSitemapPriority(parseFloat(e.target.value));
                              setSaveStatus("unsaved");
                            }}
                            className="w-full accent-[#1EDAC6]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1">Change Frequency</label>
                          <select
                            value={changeFrequency}
                            onChange={(e) => {
                              setChangeFrequency(e.target.value as Page["changeFrequency"]);
                              setSaveStatus("unsaved");
                            }}
                            className="w-full px-2 py-1 bg-surface border border-white/10 rounded text-[11px] text-white focus:outline-none"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
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
        versions={initialPage?.versionHistory}
        pageTitle={title || "Page"}
      />
    </div>
  );
}
