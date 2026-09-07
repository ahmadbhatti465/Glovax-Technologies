"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  FileText,
  Clock,
  AlertTriangle,
  Upload,
  X,
  Plus,
  Lock,
  Unlock,
  Tag,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  MoveUp,
  MoveDown,
  Star,
  Check,
  Link2,
  Image as ImageIcon,
  Quote,
  TrendingUp,
  Target,
  Lightbulb,
  Building2,
  MapPin,
  HelpCircle,
  Wand2,
  RefreshCw,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { cleanSlug, validateSlug } from "@/lib/slug";
import { PortfolioItem, PortfolioGalleryItem } from "@/types";
import { GooglePreview } from "@/components/admin/pages/GooglePreview";
import { SocialPreview } from "@/components/admin/pages/SocialPreview";
import { SeoScoreCard, calculateSeoScore } from "@/components/admin/pages/SeoScoreCard";
import { InternalLinkModal } from "@/components/admin/pages/InternalLinkModal";

const PRESET_CATEGORIES = [
  "Web Development",
  "Mobile Apps",
  "AI & Machine Learning",
  "E-commerce Website",
  "UI/UX Design",
  "Cloud & DevOps",
  "Custom Software",
  "SaaS Platform",
  "Digital Marketing & Growth",
];

const PRESET_SERVICES = [
  "Web Design & UI/UX",
  "Full-Stack Development",
  "Next.js Architecture",
  "Mobile App Development (React Native / iOS / Android)",
  "AI Chatbot & LLM Integration",
  "RAG Architecture & Document Retrieval",
  "E-commerce Storefront & Checkout",
  "Cloud Infrastructure (AWS / GCP)",
  "Technical SEO & Core Web Vitals",
  "API & Microservices Engineering",
  "Brand Identity & Art Direction",
];

interface PortfolioEditorProps {
  initialItem?: Partial<PortfolioItem>;
  isNew?: boolean;
}

export function PortfolioEditor({ initialItem, isNew = false }: PortfolioEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [activeTab, setActiveTab] = useState<
    "basic" | "content" | "media" | "seo" | "social" | "publish"
  >("basic");

  // All portfolio items for Related Projects selection
  const [allProjects, setAllProjects] = useState<{ id: string; title: string; client: string }[]>([]);
  const [isInternalLinkModalOpen, setIsInternalLinkModalOpen] = useState(false);

  // Form State - Basic Info
  const [id, setId] = useState(initialItem?.id || "");
  const [title, setTitle] = useState(initialItem?.title || "");
  const [slug, setSlug] = useState(initialItem?.slug || initialItem?.id || "");
  const [isSlugLocked, setIsSlugLocked] = useState(Boolean(initialItem?.slug || initialItem?.id));
  const [client, setClient] = useState(initialItem?.client || "");
  const [category, setCategory] = useState(initialItem?.category || "Web Development");
  const [customCategory, setCustomCategory] = useState("");
  const [shortDescription, setShortDescription] = useState(initialItem?.shortDescription || "");
  const [description, setDescription] = useState(initialItem?.description || "");
  const [link, setLink] = useState(initialItem?.link || "");
  const [clientWebsite, setClientWebsite] = useState(initialItem?.clientWebsite || "");
  const [industry, setIndustry] = useState(initialItem?.industry || "");
  const [timeline, setTimeline] = useState(initialItem?.timeline || "");
  const [projectYear, setProjectYear] = useState(
    initialItem?.projectYear || new Date().getFullYear().toString()
  );
  const [location, setLocation] = useState(initialItem?.location || "Worldwide / Remote");
  const [featured, setFeatured] = useState(Boolean(initialItem?.featured));
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    initialItem?.status || (isNew ? "draft" : "published")
  );

  // Form State - Services & Tech
  const [services, setServices] = useState<string[]>(initialItem?.services || []);
  const [technologies, setTechnologies] = useState<string[]>(
    initialItem?.technologies || ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  );
  const [newTechInput, setNewTechInput] = useState("");

  // Form State - Content & Story
  const [challenge, setChallenge] = useState(initialItem?.challenge || "");
  const [solution, setSolution] = useState(initialItem?.solution || "");
  const [processSteps, setProcessSteps] = useState<string[]>(
    initialItem?.process || [
      "Discovery & Requirements Analysis",
      "Architecture & UX Wireframing",
      "Design System & UI Prototyping",
      "Development & API Integrations",
      "Quality Assurance & Performance Optimization",
      "Deployment & Handover",
    ]
  );
  const [newStepInput, setNewStepInput] = useState("");

  const [keyFeatures, setKeyFeatures] = useState<string[]>(initialItem?.keyFeatures || []);
  const [newFeatureInput, setNewFeatureInput] = useState("");

  // Structured Results
  const [results, setResults] = useState<string[]>(
    initialItem?.results || [
      "+ 45% Organic Traffic Growth",
      "+ 72% Conversion Rate Improvement",
      "99.9% Platform Uptime Delivered",
    ]
  );
  const [newResultInput, setNewResultInput] = useState("");

  // Testimonial
  const [testimonialQuote, setTestimonialQuote] = useState(
    initialItem?.testimonialQuote || initialItem?.testimonial?.quote || ""
  );
  const [testimonialAuthor, setTestimonialAuthor] = useState(
    initialItem?.testimonialAuthor || initialItem?.testimonial?.author || ""
  );
  const [testimonialRole, setTestimonialRole] = useState(
    initialItem?.testimonialRole || initialItem?.testimonial?.role || ""
  );
  const [testimonialCompany, setTestimonialCompany] = useState(
    initialItem?.testimonialCompany || initialItem?.testimonial?.company || ""
  );
  const [testimonialRating, setTestimonialRating] = useState<number>(
    initialItem?.testimonialRating || initialItem?.testimonial?.rating || 5
  );

  // Related Projects
  const [relatedProjects, setRelatedProjects] = useState<string[]>(
    initialItem?.relatedProjects || []
  );

  // Form State - Media
  const [image, setImage] = useState(initialItem?.image || "");
  const [imageAlt, setImageAlt] = useState(initialItem?.imageAlt || "");
  const [imageTitle, setImageTitle] = useState(initialItem?.imageTitle || "");
  const [imageCaption, setImageCaption] = useState(initialItem?.imageCaption || "");
  const [imageDetails, setImageDetails] = useState<{ size?: number; fileName?: string; provider?: string } | null>(
    null
  );
  const [gallery, setGallery] = useState<PortfolioGalleryItem[]>(initialItem?.gallery || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Form State - SEO & Social
  const [seoTitle, setSeoTitle] = useState(initialItem?.seoTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialItem?.metaDescription || "");
  const [focusKeyword, setFocusKeyword] = useState(initialItem?.focusKeyword || "");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(
    initialItem?.secondaryKeywords || []
  );
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState(initialItem?.canonicalUrl || "");
  const [robotsIndex, setRobotsIndex] = useState(
    initialItem?.robotsIndex !== undefined ? initialItem.robotsIndex : true
  );
  const [robotsFollow, setRobotsFollow] = useState(
    initialItem?.robotsFollow !== undefined ? initialItem.robotsFollow : true
  );
  const [includeInSitemap, setIncludeInSitemap] = useState(
    initialItem?.includeInSitemap !== undefined ? initialItem.includeInSitemap : true
  );
  const [sitemapPriority, setSitemapPriority] = useState<number>(
    initialItem?.sitemapPriority ?? 0.8
  );
  const [changeFrequency, setChangeFrequency] = useState(
    initialItem?.changeFrequency || "monthly"
  );
  const [schemaType, setSchemaType] = useState(initialItem?.schemaType || "CreativeWork");
  const [publishedAt, setPublishedAt] = useState(
    initialItem?.publishedAt || new Date().toISOString().slice(0, 10)
  );

  // Social
  const [ogTitle, setOgTitle] = useState(initialItem?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initialItem?.ogDescription || "");
  const [ogImage, setOgImage] = useState(initialItem?.ogImage || "");
  const [ogImageAlt, setOgImageAlt] = useState(initialItem?.ogImageAlt || "");
  const [twitterTitle, setTwitterTitle] = useState(initialItem?.twitterTitle || "");
  const [twitterDescription, setTwitterDescription] = useState(
    initialItem?.twitterDescription || ""
  );
  const [twitterImage, setTwitterImage] = useState(initialItem?.twitterImage || "");

  // AI SEO Assistant Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    seoTitle: string;
    metaDescription: string;
    slug: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    imageAlt: string;
  } | null>(null);

  // 301 Redirect Handling
  const originalSlugRef = useRef(initialItem?.slug || initialItem?.id || "");
  const [createRedirectOnSlugChange, setCreateRedirectOnSlugChange] = useState(true);

  // Fetch all portfolio projects for Related Projects dropdown
  useEffect(() => {
    fetch("/api/admin/portfolio", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setAllProjects(
            data
              .filter((p) => p.id !== initialItem?.id)
              .map((p) => ({ id: p.id, title: p.title, client: p.client }))
          );
        }
      })
      .catch(() => {});
  }, [initialItem?.id]);

  // Title change handler with automatic slug generation if not locked
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSaveStatus("unsaved");
    if (!isSlugLocked || !slug) {
      const generated = cleanSlug(val);
      setSlug(generated);
      if (isNew) setId(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    const cleaned = cleanSlug(val);
    setSlug(cleaned);
    setSaveStatus("unsaved");
  };

  // Technologies management
  const handleAddTech = () => {
    const trimmed = newTechInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setNewTechInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
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

  // Service toggle
  const toggleService = (srv: string) => {
    if (services.includes(srv)) {
      setServices(services.filter((s) => s !== srv));
    } else {
      setServices([...services, srv]);
    }
    setSaveStatus("unsaved");
  };

  // Process Steps
  const handleAddStep = () => {
    if (newStepInput.trim()) {
      setProcessSteps([...processSteps, newStepInput.trim()]);
      setNewStepInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveStep = (idx: number) => {
    setProcessSteps(processSteps.filter((_, i) => i !== idx));
    setSaveStatus("unsaved");
  };

  const handleMoveStep = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= processSteps.length) return;
    const updated = [...processSteps];
    const temp = updated[idx];
    updated[idx] = updated[newIdx];
    updated[newIdx] = temp;
    setProcessSteps(updated);
    setSaveStatus("unsaved");
  };

  // Key Features
  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setKeyFeatures([...keyFeatures, newFeatureInput.trim()]);
      setNewFeatureInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setKeyFeatures(keyFeatures.filter((_, i) => i !== idx));
    setSaveStatus("unsaved");
  };

  // Results Cards
  const handleAddResult = () => {
    if (newResultInput.trim()) {
      setResults([...results, newResultInput.trim()]);
      setNewResultInput("");
      setSaveStatus("unsaved");
    }
  };

  const handleRemoveResult = (idx: number) => {
    setResults(results.filter((_, i) => i !== idx));
    setSaveStatus("unsaved");
  };

  // Primary Image Upload
  const handlePrimaryImageUpload = async (file: File) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
        setImageDetails({ size: data.size, fileName: data.fileName, provider: data.provider });
        if (!ogImage) setOgImage(data.url);
        if (!imageAlt) {
          const autoAlt = `${title || "Portfolio project"} for ${client || "client"} — ${category}`;
          setImageAlt(autoAlt);
        }
        setSaveStatus("unsaved");
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch {
      alert("Failed to upload primary image");
    }
    setUploadingImage(false);
  };

  // Gallery Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploaded: PortfolioGalleryItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok && data.url) {
          uploaded.push({
            url: data.url,
            alt: `${title || "Project"} screenshot ${gallery.length + uploaded.length + 1}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
          });
        }
      }
      setGallery([...gallery, ...uploaded]);
      setSaveStatus("unsaved");
    } catch {
      alert("Failed to upload gallery images");
    }
    setUploadingGallery(false);
  };

  const handleRemoveGalleryItem = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
    setSaveStatus("unsaved");
  };

  // Generate AI SEO Suggestions
  const handleGenerateAiSuggestions = () => {
    const activeCategory = category === "Custom" ? customCategory : category;
    const cleanKw = focusKeyword || `${title} ${activeCategory}`.toLowerCase();
    const suggestedTitle = `${title || "Client Project"} | ${activeCategory} Case Study | ${siteConfig.name}`;
    const descBase =
      shortDescription ||
      description.slice(0, 100) ||
      `${title} built for ${client} by ${siteConfig.name}.`;
    const suggestedMeta = `${descBase} Discover challenges solved, tech stack utilized, and results achieved with Glovax Technologies.`.slice(
      0,
      155
    );
    const suggestedSlug = cleanSlug(title || id);
    const suggestedAlt = `${title || "Project"} developed for ${client || "Client"} - ${activeCategory} showcase`;
    const suggestedSecondary = [
      activeCategory.toLowerCase(),
      ...technologies.slice(0, 4).map((t) => t.toLowerCase()),
      "software development case study",
    ].filter((v, i, a) => a.indexOf(v) === i);

    setAiSuggestions({
      seoTitle: suggestedTitle.slice(0, 60),
      metaDescription: suggestedMeta,
      slug: suggestedSlug,
      focusKeyword: cleanKw,
      secondaryKeywords: suggestedSecondary,
      imageAlt: suggestedAlt,
    });
    setIsAiModalOpen(true);
  };

  const applyAiSuggestion = (field: keyof NonNullable<typeof aiSuggestions>) => {
    if (!aiSuggestions) return;
    if (field === "seoTitle") setSeoTitle(aiSuggestions.seoTitle);
    if (field === "metaDescription") setMetaDescription(aiSuggestions.metaDescription);
    if (field === "slug") {
      setSlug(aiSuggestions.slug);
      setIsSlugLocked(true);
    }
    if (field === "focusKeyword") setFocusKeyword(aiSuggestions.focusKeyword);
    if (field === "secondaryKeywords") setSecondaryKeywords(aiSuggestions.secondaryKeywords);
    if (field === "imageAlt") setImageAlt(aiSuggestions.imageAlt);
    setSaveStatus("unsaved");
  };

  const applyAllAiSuggestions = () => {
    if (!aiSuggestions) return;
    setSeoTitle(aiSuggestions.seoTitle);
    setMetaDescription(aiSuggestions.metaDescription);
    setSlug(aiSuggestions.slug);
    setIsSlugLocked(true);
    setFocusKeyword(aiSuggestions.focusKeyword);
    setSecondaryKeywords(aiSuggestions.secondaryKeywords);
    setImageAlt(aiSuggestions.imageAlt);
    setSaveStatus("unsaved");
    setIsAiModalOpen(false);
  };

  // Calculate Real-time SEO
  const contentCombined = useMemo(() => {
    return [
      description,
      challenge,
      solution,
      ...results,
      ...processSteps,
      ...keyFeatures,
      testimonialQuote,
    ].join(" ");
  }, [description, challenge, solution, results, processSteps, keyFeatures, testimonialQuote]);

  const seoScoreResult = useMemo(() => {
    return calculateSeoScore({
      title,
      slug: `work/${slug || id}`,
      seoTitle,
      metaDescription,
      focusKeyword,
      content: contentCombined,
      featuredImage: image,
      featuredImageAlt: imageAlt,
      robotsIndex,
    });
  }, [title, slug, id, seoTitle, metaDescription, focusKeyword, contentCombined, image, imageAlt, robotsIndex]);

  // Save / Submit
  const handleSave = async (forcedStatus?: "draft" | "published" | "archived") => {
    if (!title.trim()) {
      alert("Please provide a project title");
      setActiveTab("basic");
      return;
    }
    if (!client.trim()) {
      alert("Please provide a client name");
      setActiveTab("basic");
      return;
    }
    if (!description.trim()) {
      alert("Please provide a project description");
      setActiveTab("basic");
      return;
    }

    const finalSlug = slug || cleanSlug(title) || id;
    const finalStatus = forcedStatus || status;

    setSaving(true);
    setSaveStatus("saving");

    const payload = {
      id: isNew ? (id || finalSlug) : initialItem?.id,
      title: title.trim(),
      slug: finalSlug,
      client: client.trim(),
      category: category === "Custom" ? customCategory.trim() || "Custom Software" : category,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      link: link.trim() || null,
      clientWebsite: clientWebsite.trim() || null,
      industry: industry.trim() || null,
      services,
      technologies,
      timeline: timeline.trim() || null,
      projectYear: projectYear.trim() || null,
      location: location.trim() || null,
      featured,
      status: finalStatus,
      challenge: challenge.trim() || null,
      solution: solution.trim() || null,
      process: processSteps,
      results,
      keyFeatures,
      testimonialQuote: testimonialQuote.trim() || null,
      testimonialAuthor: testimonialAuthor.trim() || null,
      testimonialRole: testimonialRole.trim() || null,
      testimonialCompany: testimonialCompany.trim() || null,
      testimonialRating,
      image: image || null,
      imageAlt: imageAlt.trim() || null,
      imageTitle: imageTitle.trim() || null,
      imageCaption: imageCaption.trim() || null,
      gallery,
      relatedProjects,
      seoTitle: seoTitle.trim() || null,
      metaDescription: metaDescription.trim() || null,
      focusKeyword: focusKeyword.trim() || null,
      secondaryKeywords,
      canonicalUrl: canonicalUrl.trim() || null,
      robotsIndex,
      robotsFollow,
      includeInSitemap,
      sitemapPriority,
      changeFrequency,
      ogTitle: ogTitle.trim() || null,
      ogDescription: ogDescription.trim() || null,
      ogImage: ogImage.trim() || null,
      ogImageAlt: ogImageAlt.trim() || null,
      twitterTitle: twitterTitle.trim() || null,
      twitterDescription: twitterDescription.trim() || null,
      twitterImage: twitterImage.trim() || null,
      schemaType,
      publishedAt: publishedAt || new Date().toISOString().slice(0, 10),
      createRedirect: !isNew && createRedirectOnSlugChange && originalSlugRef.current !== finalSlug,
    };

    try {
      const url = isNew ? "/api/admin/portfolio" : `/api/admin/portfolio/${initialItem?.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save portfolio item");
        setSaving(false);
        setSaveStatus("unsaved");
        return;
      }

      setSaveStatus("saved");
      if (forcedStatus) setStatus(forcedStatus);
      originalSlugRef.current = finalSlug;

      if (isNew) {
        router.push(`/admin/dashboard/portfolio/${data.item.id}`);
      }
    } catch {
      alert("Error saving portfolio item");
      setSaveStatus("unsaved");
    }
    setSaving(false);
  };

  // Debounced autosave for existing records
  useEffect(() => {
    if (isNew || saveStatus !== "unsaved") return;
    const timer = setTimeout(() => {
      handleSave();
    }, 15000);
    return () => clearTimeout(timer);
  }, [saveStatus, isNew]);

  const slugValidation = useMemo(() => validateSlug(slug || "project"), [slug]);
  const canonicalPreview = canonicalUrl || `${siteConfig.url}/work/${slug || id || "project"}`;

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#1EDAC6]/20 bg-surface-raised sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/dashboard/portfolio"
              className="p-1.5 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white transition-colors shrink-0"
              title="Back to Portfolio List"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                {title || (isNew ? "New Portfolio Project" : "Edit Project")}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span>/work/{slug || id || "..."}</span>
                <span>•</span>
                <span
                  className={`capitalize font-semibold ${
                    status === "published"
                      ? "text-emerald-400"
                      : status === "draft"
                      ? "text-amber-400"
                      : "text-gray-400"
                  }`}
                >
                  {status}
                </span>
                <span>•</span>
                <span className="text-gray-400">
                  {saveStatus === "saved" ? "✓ Saved" : saveStatus === "saving" ? "Saving…" : "● Unsaved changes"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live Preview link */}
            {!isNew && (
              <a
                href={`/work/${slug || id}?preview=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-card-hover border border-white/10 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                title="Preview public page"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
            )}

            {/* AI Assistant button */}
            <button
              type="button"
              onClick={handleGenerateAiSuggestions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1EDAC6]/10 hover:bg-[#1EDAC6]/20 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg transition-colors shadow-sm"
              title="Generate AI SEO Suggestions"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">AI SEO</span> Assistant
            </button>

            {/* Save Draft */}
            {status !== "draft" && (
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-card-hover border border-white/10 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 text-gray-300"
              >
                Save as Draft
              </button>
            )}

            {/* Publish / Save */}
            <button
              type="button"
              onClick={() => handleSave(status === "draft" ? "published" : undefined)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(30,218,198,0.25)] disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving…" : status === "draft" ? "Publish Project" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout: 2 Columns on Desktop */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT AREA: Content & Tab Navigation (7 or 8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab Header */}
            <div className="flex items-center gap-1 bg-surface-raised p-1 rounded-xl border border-[#1EDAC6]/20 overflow-x-auto">
              {[
                { id: "basic", label: "1. Basic Info", icon: Briefcase },
                { id: "content", label: "2. Project Story", icon: FileText },
                { id: "media", label: "3. Media & Gallery", icon: ImageIcon },
                { id: "seo", label: "4. SEO & Keywords", icon: Globe },
                { id: "social", label: "5. Social Share", icon: Share2 },
                { id: "publish", label: "6. Publishing", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#1EDAC6] text-black font-bold shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-card"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === "basic" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#1EDAC6]" /> Project Fundamentals
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Core client details, classification, live URLs and project metadata.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. PurestStem — Natural Herbal Skincare"
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6] transition-colors"
                      required
                    />
                  </div>

                  {/* Slug & Lock Toggle */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-300">
                        URL Slug <span className="text-red-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsSlugLocked(!isSlugLocked)}
                        className="text-[11px] text-[#1EDAC6] hover:underline flex items-center gap-1"
                      >
                        {isSlugLocked ? (
                          <>
                            <Lock className="w-3 h-3" /> Edit custom slug
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" /> Auto-sync with title
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono px-2.5 py-2.5 bg-card/60 rounded-lg border border-white/5">
                        /work/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        disabled={isSlugLocked}
                        placeholder="pureststem-ecommerce"
                        className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6] disabled:opacity-60 transition-colors"
                      />
                    </div>
                    {!slugValidation.valid && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {slugValidation.error}
                      </p>
                    )}
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Client / Company Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => {
                        setClient(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. PurestStem"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                    >
                      {PRESET_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="Custom">Custom Category…</option>
                    </select>
                    {category === "Custom" && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => {
                          setCustomCategory(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="Enter custom category"
                        className="w-full mt-2 px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                      />
                    )}
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. E-commerce · Skincare & Beauty"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Timeline / Duration */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Project Duration / Timeline
                    </label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => {
                        setTimeline(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. 5 weeks"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Project Year */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Project Year
                    </label>
                    <input
                      type="text"
                      value={projectYear}
                      onChange={(e) => {
                        setProjectYear(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="2025"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Client Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. United States, United Kingdom, Remote"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Live Project URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Live Project URL
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => {
                          setLink(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="https://example.com"
                        className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                      {link && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-gray-400 hover:text-white"
                          title="Open live link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Client Website */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Client Official Website
                    </label>
                    <input
                      type="url"
                      value={clientWebsite}
                      onChange={(e) => {
                        setClientWebsite(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="https://client.com"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Short Description / Card Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={shortDescription}
                      onChange={(e) => {
                        setShortDescription(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="A concise 1-2 sentence overview shown on portfolio cards and preview teasers…"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Full Description / Overview */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Full Project Overview <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="Comprehensive overview of the client engagement, goals, and delivery…"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      required
                    />
                  </div>

                  {/* Services Delivered Multi-select */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Services Delivered
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_SERVICES.map((srv) => {
                        const isChecked = services.includes(srv);
                        return (
                          <button
                            key={srv}
                            type="button"
                            onClick={() => toggleService(srv)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                              isChecked
                                ? "bg-[#1EDAC6]/15 border-[#1EDAC6] text-[#1EDAC6]"
                                : "bg-card border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                            {srv}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Technologies Tag Input */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Technologies & Tools Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-card border border-[#1EDAC6]/20 rounded-lg min-h-[46px] items-center">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#1EDAC6]/10 text-[#1EDAC6] border border-[#1EDAC6]/30"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newTechInput}
                        onChange={(e) => setNewTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        placeholder="Add technology (press Enter)..."
                        className="bg-transparent border-none text-xs text-white placeholder:text-gray-500 focus:outline-none flex-1 min-w-[140px] px-1"
                      />
                    </div>
                  </div>

                  {/* Featured & Status */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => {
                          setFeatured(e.target.checked);
                          setSaveStatus("unsaved");
                        }}
                        className="w-4 h-4 accent-[#1EDAC6] rounded"
                      />
                      <span>Feature this project on the homepage showcase</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Publication Status:</span>
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value as typeof status);
                          setSaveStatus("unsaved");
                        }}
                        className="px-3 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-[#1EDAC6]"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROJECT STORY & DEEP CONTENT */}
            {activeTab === "content" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1EDAC6]" /> In-Depth Case Study Story
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Describe the business challenge, your engineering solution, measurable results and client testimony.
                  </p>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> The Business Challenge
                    </label>
                    <textarea
                      rows={4}
                      value={challenge}
                      onChange={(e) => {
                        setChallenge(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="What friction, technical debt, or commercial problem was the client facing?"
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[#1EDAC6]" /> Our Technical Solution
                    </label>
                    <textarea
                      rows={4}
                      value={solution}
                      onChange={(e) => {
                        setSolution(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="How did Glovax Technologies design and implement the software/architecture to overcome the challenge?"
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>
                </div>

                {/* Structured Outcome & Results Cards */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Key Measurable Results
                      </label>
                      <span className="text-[11px] text-gray-400">
                        Structured outcome highlights (e.g. + 45% Traffic, 99.9% Uptime)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {results.map((res, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-emerald-500/20 text-xs text-white"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{res}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(idx)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResultInput}
                      onChange={(e) => setNewResultInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddResult();
                        }
                      }}
                      placeholder="+ 50% Mobile Conversion Rate..."
                      className="flex-1 px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddResult}
                      className="px-3.5 py-2 bg-[#1EDAC6]/15 hover:bg-[#1EDAC6]/25 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Result
                    </button>
                  </div>
                </div>

                {/* Implementation Process Steps */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1EDAC6]" /> Implementation Process Steps
                  </label>
                  <div className="space-y-2">
                    {processSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-card border border-white/5 text-xs text-gray-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#1EDAC6]/20 text-[#1EDAC6] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, "down")}
                            disabled={idx === processSteps.length - 1}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                          >
                            <MoveDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="p-1 text-gray-400 hover:text-red-400 ml-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStepInput}
                      onChange={(e) => setNewStepInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStep();
                        }
                      }}
                      placeholder="Add engineering or design phase..."
                      className="flex-1 px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3.5 py-2 bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-xs font-semibold rounded-lg text-gray-300 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Phase
                    </button>
                  </div>
                </div>

                {/* Client Testimonial */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-[#1EDAC6]" /> Client Testimonial & Review
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Optional client feedback attributed to this project. Never fabricate client praise.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <textarea
                        rows={2}
                        value={testimonialQuote}
                        onChange={(e) => {
                          setTestimonialQuote(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="&quot;Working with Glovax Technologies was seamless...&quot;"
                        className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={testimonialAuthor}
                        onChange={(e) => {
                          setTestimonialAuthor(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="Author Name (e.g. John Doe)"
                        className="w-full px-3.5 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={testimonialRole}
                        onChange={(e) => {
                          setTestimonialRole(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="Role / Title (e.g. Co-Founder & CEO)"
                        className="w-full px-3.5 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={testimonialCompany}
                        onChange={(e) => {
                          setTestimonialCompany(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="Company Name"
                        className="w-full px-3.5 py-1.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              setTestimonialRating(star);
                              setSaveStatus("unsaved");
                            }}
                            className={`p-1 ${
                              star <= testimonialRating ? "text-amber-400" : "text-gray-600"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Projects Cross-linking */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-[#1EDAC6]" /> Related Projects (Internal Linking)
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Select other portfolio case studies to recommend at the footer of this case study.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {allProjects.map((p) => {
                      const isSelected = relatedProjects.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setRelatedProjects(relatedProjects.filter((id) => id !== p.id));
                            } else {
                              setRelatedProjects([...relatedProjects, p.id]);
                            }
                            setSaveStatus("unsaved");
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-[#1EDAC6]/15 border-[#1EDAC6] text-[#1EDAC6]"
                              : "bg-card border-white/5 text-gray-300 hover:border-white/20"
                          }`}
                        >
                          <span className="truncate">
                            {p.title} <span className="text-gray-400">({p.client})</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA MANAGEMENT & GALLERY */}
            {activeTab === "media" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#1EDAC6]" /> Media Assets & Image SEO
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    High-resolution primary mockup image, accessible alt text, captions, and supplementary screenshots gallery.
                  </p>
                </div>

                {/* Primary Image Dropzone */}
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-gray-200">
                    Primary Showcase Mockup / Cover Image
                  </label>

                  {image ? (
                    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-card p-2 flex flex-col sm:flex-row gap-4 items-center">
                      <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/5 shrink-0">
                        <Image
                          src={image.startsWith("/") || image.startsWith("http") || image.startsWith("data:") ? image : `/${image}`}
                          alt={imageAlt || "Project preview"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-xs w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] text-gray-300 truncate max-w-[200px]">
                            {image.startsWith("data:") ? "Embedded Data Image" : image}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setImage("");
                              setImageDetails(null);
                              setSaveStatus("unsaved");
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          {imageDetails?.size ? <span>{Math.round(imageDetails.size / 1024)} KB</span> : null}
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                            {imageDetails?.provider === "cloudinary"
                              ? "Cloudinary CDN"
                              : imageDetails?.provider === "vercel-blob"
                              ? "Vercel Blob"
                              : image.startsWith("http")
                              ? "Cloud Storage"
                              : image.startsWith("data:")
                              ? "Direct Embedded"
                              : "Local /uploads"}
                          </span>
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-[#1EDAC6] hover:underline">
                          <Upload className="w-3 h-3" /> Replace image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handlePrimaryImageUpload(f);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files?.[0];
                        if (f) handlePrimaryImageUpload(f);
                      }}
                      className="border-2 border-dashed border-[#1EDAC6]/30 hover:border-[#1EDAC6] rounded-xl p-8 text-center bg-card/40 transition-colors cursor-pointer group"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        id="primary-image-upload"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePrimaryImageUpload(f);
                        }}
                        className="hidden"
                      />
                      <label htmlFor="primary-image-upload" className="cursor-pointer block space-y-2">
                        <Upload className="w-8 h-8 text-[#1EDAC6] mx-auto group-hover:scale-110 transition-transform" />
                        <p className="text-xs font-semibold text-white">
                          {uploadingImage ? "Uploading & optimizing image…" : "Drag & drop primary image here or browse"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Supports WebP, PNG, JPG, AVIF (Max 5MB)
                        </p>
                      </label>
                    </div>
                  )}

                  {/* Primary Alt Text (Crucial for SEO & Accessibility) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-300">
                        Primary Image Alt Text <span className="text-[#1EDAC6]">* (SEO Critical)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const auto = `${title || "Project"} built for ${client || "Client"} — ${category} preview`;
                          setImageAlt(auto);
                          setSaveStatus("unsaved");
                        }}
                        className="text-[11px] text-[#1EDAC6] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-suggest Alt Text
                      </button>
                    </div>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => {
                        setImageAlt(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="Descriptive alt text for screen readers and Google Image search…"
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                    {!imageAlt && (
                      <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Images without alt text fail accessibility and SEO audits.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Image Title (Optional tooltip)
                      </label>
                      <input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => {
                          setImageTitle(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="e.g. PurestStem Homepage Mockup"
                        className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Image Caption (Display on page)
                      </label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => {
                          setImageCaption(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder="e.g. Modern responsive storefront for PurestStem"
                        className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Screenshots Gallery Section */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-semibold text-white">
                        Additional Screenshots & UI Gallery
                      </label>
                      <p className="text-[11px] text-gray-400">
                        Upload multi-screen flows, dashboard views or mobile mockups.
                      </p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-[#1EDAC6]/15 hover:bg-[#1EDAC6]/25 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      <span>{uploadingGallery ? "Uploading…" : "Add Screenshots"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {gallery.length === 0 ? (
                    <div className="p-6 text-center border border-white/5 rounded-xl bg-card/30 text-xs text-gray-500">
                      No additional screenshots in gallery. Click &quot;Add Screenshots&quot; to upload multiple visuals.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gallery.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-card border border-white/10 rounded-xl space-y-2 relative group"
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/5">
                            <Image
                              src={item.url.startsWith("/") || item.url.startsWith("http") || item.url.startsWith("data:") ? item.url : `/${item.url}`}
                              alt={item.alt || `Screenshot ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryItem(idx)}
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-black/70 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete screenshot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.alt || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[idx].alt = e.target.value;
                              setGallery(updated);
                              setSaveStatus("unsaved");
                            }}
                            placeholder="Alt text for this screenshot…"
                            className="w-full px-2.5 py-1.5 bg-background border border-white/5 rounded text-[11px] text-white focus:outline-none focus:border-[#1EDAC6]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: TECHNICAL SEO CMS & ROBOTS */}
            {activeTab === "seo" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#1EDAC6]" /> Technical SEO Control Panel
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Fine-tune search engine visibility, focus keywords, canonical tags, and crawling directives.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiSuggestions}
                    className="px-3 py-1.5 bg-[#1EDAC6]/10 border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg hover:bg-[#1EDAC6]/20 transition-colors flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" /> AI Suggest
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Focus Keyword */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Focus Keyword / Keyphrase
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => {
                        setFocusKeyword(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="e.g. e-commerce website development"
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Our real-time SEO auditor verifies this phrase in your Title, Meta Description, URL Slug, and Content.
                    </p>
                  </div>

                  {/* Secondary Keywords */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Secondary Keywords & LSI Terms
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-card border border-[#1EDAC6]/20 rounded-lg min-h-[42px] items-center">
                      {secondaryKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/5 text-gray-200 border border-white/10"
                        >
                          {kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                        placeholder="Add secondary keyword (Enter)..."
                        className="bg-transparent border-none text-xs text-white placeholder:text-gray-500 focus:outline-none flex-1 min-w-[150px] px-1"
                      />
                    </div>
                  </div>

                  {/* SEO Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-300">
                        SEO Title (Search SERP)
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          seoTitle.length >= 50 && seoTitle.length <= 60
                            ? "text-emerald-400"
                            : seoTitle.length > 60
                            ? "text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {seoTitle.length}/60 chars ({seoTitle.length >= 50 && seoTitle.length <= 60 ? "✓ Good length" : seoTitle.length > 60 ? "⚠ Too long" : "⚠ Short"})
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => {
                        setSeoTitle(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={`${title || "Project Title"} | Case Study | Glovax Technologies`}
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-300">
                        Meta Description
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          metaDescription.length >= 140 && metaDescription.length <= 160
                            ? "text-emerald-400"
                            : metaDescription.length > 160
                            ? "text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        {metaDescription.length}/160 chars ({metaDescription.length >= 140 && metaDescription.length <= 160 ? "✓ Optimal length" : metaDescription.length > 160 ? "⚠ Too long" : "⚠ Short"})
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => {
                        setMetaDescription(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder="Compelling summary explaining the project challenge, technology solution, and business impact for search click-throughs…"
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Canonical URL Override
                    </label>
                    <input
                      type="url"
                      value={canonicalUrl}
                      onChange={(e) => {
                        setCanonicalUrl(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={canonicalPreview}
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Defaults to <code className="text-gray-400">{canonicalPreview}</code> if left blank.
                    </p>
                  </div>

                  {/* Robots & Sitemap Directives Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    {/* Indexability */}
                    <div className="p-3.5 rounded-xl bg-card border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-white block">
                        Search Engine Indexing
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRobotsIndex(true);
                            setSaveStatus("unsaved");
                          }}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            robotsIndex
                              ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                              : "bg-background border-white/5 text-gray-400"
                          }`}
                        >
                          Index (Allow)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRobotsIndex(false);
                            setSaveStatus("unsaved");
                          }}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            !robotsIndex
                              ? "bg-red-500/15 border-red-500 text-red-400"
                              : "bg-background border-white/5 text-gray-400"
                          }`}
                        >
                          Noindex
                        </button>
                      </div>
                    </div>

                    {/* Link Following */}
                    <div className="p-3.5 rounded-xl bg-card border border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-white block">
                        Link Following
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRobotsFollow(true);
                            setSaveStatus("unsaved");
                          }}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            robotsFollow
                              ? "bg-[#1EDAC6]/15 border-[#1EDAC6] text-[#1EDAC6]"
                              : "bg-background border-white/5 text-gray-400"
                          }`}
                        >
                          Follow Links
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRobotsFollow(false);
                            setSaveStatus("unsaved");
                          }}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                            !robotsFollow
                              ? "bg-amber-500/15 border-amber-500 text-amber-400"
                              : "bg-background border-white/5 text-gray-400"
                          }`}
                        >
                          Nofollow
                        </button>
                      </div>
                    </div>

                    {/* XML Sitemap */}
                    <div className="p-3.5 rounded-xl bg-card border border-white/5 space-y-2 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          XML Sitemap Settings
                        </span>
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                          <input
                            type="checkbox"
                            checked={includeInSitemap}
                            onChange={(e) => {
                              setIncludeInSitemap(e.target.checked);
                              setSaveStatus("unsaved");
                            }}
                            className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                          />
                          <span>Include in XML Sitemap (/sitemap.xml)</span>
                        </label>
                      </div>

                      {includeInSitemap && (
                        <div className="grid grid-cols-2 gap-3 pt-1">
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
                            <label className="block text-[11px] text-gray-400 mb-1">
                              Change Frequency
                            </label>
                            <select
                              value={changeFrequency}
                              onChange={(e) => {
                                setChangeFrequency(e.target.value as typeof changeFrequency);
                                setSaveStatus("unsaved");
                              }}
                              className="w-full px-2.5 py-1.5 bg-background border border-white/10 rounded text-xs text-white focus:outline-none"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="always">Always</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Schema Type */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Structured Data JSON-LD Schema Type
                      </label>
                      <select
                        value={schemaType}
                        onChange={(e) => {
                          setSchemaType(e.target.value as typeof schemaType);
                          setSaveStatus("unsaved");
                        }}
                        className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                      >
                        <option value="CreativeWork">CreativeWork (Recommended for Portfolio)</option>
                        <option value="Article">Article (Recommended for In-depth Case Studies)</option>
                        <option value="WebPage">WebPage (Standard)</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SOCIAL SHARE & OPEN GRAPH */}
            {activeTab === "social" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#1EDAC6]" /> Social Sharing & OpenGraph / Twitter Cards
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Customize how this portfolio project appears when shared on LinkedIn, X/Twitter, WhatsApp, and Slack.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      OpenGraph Title
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => {
                        setOgTitle(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={seoTitle || title || "Title for social media..."}
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      OpenGraph Description
                    </label>
                    <textarea
                      rows={3}
                      value={ogDescription}
                      onChange={(e) => {
                        setOgDescription(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      placeholder={metaDescription || shortDescription || "Description for social sharing previews…"}
                      className="w-full px-3.5 py-2.5 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Social Card Image (1200 × 630 px)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ogImage}
                        onChange={(e) => {
                          setOgImage(e.target.value);
                          setSaveStatus("unsaved");
                        }}
                        placeholder={image || "/images/glovax-og.png"}
                        className="flex-1 px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                      />
                      {image && (
                        <button
                          type="button"
                          onClick={() => {
                            setOgImage(image);
                            setSaveStatus("unsaved");
                          }}
                          className="px-3 py-2 bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-xs font-semibold rounded-lg text-gray-300 hover:text-white"
                        >
                          Use Primary Image
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Twitter / X Specific Overrides */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <span className="text-xs font-semibold text-white block">
                      Twitter / X Card Customization
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={twitterTitle}
                          onChange={(e) => {
                            setTwitterTitle(e.target.value);
                            setSaveStatus("unsaved");
                          }}
                          placeholder="Twitter Title (falls back to OG Title)"
                          className="w-full px-3 py-2 bg-card border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={twitterDescription}
                          onChange={(e) => {
                            setTwitterDescription(e.target.value);
                            setSaveStatus("unsaved");
                          }}
                          placeholder="Twitter Description (falls back to OG Description)"
                          className="w-full px-3 py-2 bg-card border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: PUBLISHING & ADVANCED SETTINGS */}
            {activeTab === "publish" && (
              <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#1EDAC6]" /> Publishing & Redirect Controls
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Publication date, URL management, and internal link helpers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={publishedAt}
                      onChange={(e) => {
                        setPublishedAt(e.target.value);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Status State
                    </label>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value as typeof status);
                        setSaveStatus("unsaved");
                      }}
                      className="w-full px-3.5 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-xs text-white focus:outline-none focus:border-[#1EDAC6]"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Private / Not in sitemap)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* 301 Redirect Checkbox */}
                  {!isNew && originalSlugRef.current !== slug && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-semibold">
                          URL Slug Changed from &quot;/work/{originalSlugRef.current}&quot; to &quot;/work/{slug}&quot;
                        </span>
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-200">
                        <input
                          type="checkbox"
                          checked={createRedirectOnSlugChange}
                          onChange={(e) => setCreateRedirectOnSlugChange(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#1EDAC6] rounded mt-0.5"
                        />
                        <span>
                          Automatically create a 301 Permanent Redirect from <code>/work/{originalSlugRef.current}</code> to <code>/work/{slug}</code> to protect SEO ranking.
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Internal Link Explorer */}
                  <div className="sm:col-span-2 pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Internal Link Explorer
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Search and copy markdown internal links to Glovax services & articles.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsInternalLinkModalOpen(true)}
                      className="px-3.5 py-1.5 bg-card border border-white/10 hover:border-[#1EDAC6]/40 text-xs font-medium rounded-lg text-gray-300 hover:text-white"
                    >
                      <Link2 className="w-3.5 h-3.5 inline mr-1" /> Browse Site Links
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: Real-time SEO Score & Previews (4 columns) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Real-time SEO Audit Card */}
            <SeoScoreCard
              title={title}
              slug={`work/${slug || id}`}
              seoTitle={seoTitle}
              metaDescription={metaDescription}
              focusKeyword={focusKeyword}
              content={contentCombined}
              featuredImage={image}
              featuredImageAlt={imageAlt}
              robotsIndex={robotsIndex}
            />

            {/* Live Google Search Preview */}
            <GooglePreview
              title={title}
              slug={`work/${slug || id}`}
              seoTitle={seoTitle}
              metaDescription={metaDescription}
            />

            {/* Live Social Share Card Preview */}
            <SocialPreview
              title={title}
              seoTitle={seoTitle}
              metaDescription={metaDescription}
              ogTitle={ogTitle}
              ogDescription={ogDescription}
              ogImage={ogImage || image}
              twitterTitle={twitterTitle}
              twitterDescription={twitterDescription}
              twitterImage={twitterImage || ogImage || image}
            />
          </div>
        </div>
      </main>

      {/* AI SEO Assistant Modal */}
      {isAiModalOpen && aiSuggestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-raised border border-[#1EDAC6]/30 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-[#1EDAC6]" />
                <div>
                  <h3 className="font-bold text-white text-base">AI SEO Content Assistant</h3>
                  <span className="text-[11px] text-gray-400">
                    Generated recommendations based on your project details. Review before applying.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* SEO Title Suggestion */}
              <div className="p-3 bg-card rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300">Suggested SEO Title</span>
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion("seoTitle")}
                    className="text-[#1EDAC6] hover:underline text-[11px] font-semibold"
                  >
                    Apply Title
                  </button>
                </div>
                <p className="text-white font-mono text-xs">{aiSuggestions.seoTitle}</p>
              </div>

              {/* Meta Description Suggestion */}
              <div className="p-3 bg-card rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300">Suggested Meta Description</span>
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion("metaDescription")}
                    className="text-[#1EDAC6] hover:underline text-[11px] font-semibold"
                  >
                    Apply Meta Description
                  </button>
                </div>
                <p className="text-gray-200 text-xs leading-relaxed">{aiSuggestions.metaDescription}</p>
              </div>

              {/* Focus Keyword & Secondary */}
              <div className="p-3 bg-card rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300">Keywords Recommendation</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyAiSuggestion("focusKeyword")}
                      className="text-[#1EDAC6] hover:underline text-[11px] font-semibold"
                    >
                      Apply Focus
                    </button>
                    <button
                      type="button"
                      onClick={() => applyAiSuggestion("secondaryKeywords")}
                      className="text-[#1EDAC6] hover:underline text-[11px] font-semibold"
                    >
                      Apply Secondary
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#1EDAC6]/20 text-[#1EDAC6] font-semibold">
                    Focus: {aiSuggestions.focusKeyword}
                  </span>
                  {aiSuggestions.secondaryKeywords.map((k) => (
                    <span key={k} className="px-2 py-0.5 rounded bg-white/5 text-gray-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alt text suggestion */}
              <div className="p-3 bg-card rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-300">Suggested Image Alt Text</span>
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion("imageAlt")}
                    className="text-[#1EDAC6] hover:underline text-[11px] font-semibold"
                  >
                    Apply Alt Text
                  </button>
                </div>
                <p className="text-gray-200 text-xs">{aiSuggestions.imageAlt}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white"
              >
                Close without applying
              </button>
              <button
                type="button"
                onClick={applyAllAiSuggestions}
                className="px-4 py-2 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(30,218,198,0.25)]"
              >
                Apply All Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Link Search Modal */}
      {isInternalLinkModalOpen && (
        <InternalLinkModal
          isOpen={isInternalLinkModalOpen}
          onClose={() => setIsInternalLinkModalOpen(false)}
          onInsert={(linkData) => {
            alert(`Selected link: [${linkData.text}](${linkData.url})`);
            setIsInternalLinkModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
