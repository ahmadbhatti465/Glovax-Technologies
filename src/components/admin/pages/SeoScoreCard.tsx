"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface SeoScoreCardProps {
  title: string;
  slug: string;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  robotsIndex: boolean;
}

export interface SeoAnalysisResult {
  score: number;
  grade: "Excellent" | "Good" | "Needs Improvement" | "Poor";
  passed: string[];
  improvements: string[];
  metrics: {
    wordCount: number;
    charCount: number;
    readTimeMin: number;
    headingsCount: number;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    internalLinksCount: number;
    externalLinksCount: number;
    imagesCount: number;
    imagesWithoutAltCount: number;
  };
}

export function calculateSeoScore({
  title,
  slug,
  seoTitle,
  metaDescription,
  focusKeyword,
  content,
  featuredImage,
  featuredImageAlt,
  robotsIndex,
}: SeoScoreCardProps): SeoAnalysisResult {
  const cleanKeyword = (focusKeyword || "").trim().toLowerCase();
  const activeTitle = (seoTitle || title || "").trim();
  const activeMeta = (metaDescription || "").trim();
  const activeSlug = (slug || "").toLowerCase();

  // Strip HTML to get plain text
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plainText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = plainText.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 220));

  // Extract headings (supports Markdown and HTML)
  const mdH1 = content.match(/^#\s+[^\n]+/gm) || [];
  const mdH2 = content.match(/^##\s+[^\n]+/gm) || [];
  const mdH3 = content.match(/^###\s+[^\n]+/gm) || [];

  const htmlH1 = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const htmlH2 = content.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const htmlH3 = content.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi) || [];

  const h1Count = mdH1.length + htmlH1.length;
  const h2Count = mdH2.length + htmlH2.length;
  const h3Count = mdH3.length + htmlH3.length;
  const totalHeadings = h1Count + h2Count + h3Count;

  // Extract links (supports Markdown [text](url) and HTML <a href="...">)
  const mdLinks = Array.from(content.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g));
  const htmlLinks = Array.from(content.matchAll(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi));

  let internalLinksCount = 0;
  let externalLinksCount = 0;

  mdLinks.forEach((m) => {
    const href = m[2] || "";
    if (href.startsWith("/") || href.startsWith("#") || href.includes("glovaxtechnologies.com") || href.includes("localhost")) {
      internalLinksCount++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      externalLinksCount++;
    }
  });

  htmlLinks.forEach((m) => {
    const href = m[1] || "";
    if (href.startsWith("/") || href.startsWith("#") || href.includes("glovaxtechnologies.com") || href.includes("localhost")) {
      internalLinksCount++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      externalLinksCount++;
    }
  });

  // Extract images (supports Markdown ![alt](url) and HTML <img ...>)
  const mdImgs = Array.from(content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g));
  const htmlImgs = Array.from(content.matchAll(/<img\b([^>]*)>/gi));

  let totalImages = mdImgs.length + htmlImgs.length;
  let imagesWithoutAlt = 0;

  mdImgs.forEach((m) => {
    const alt = (m[1] || "").trim();
    if (!alt) imagesWithoutAlt++;
  });

  htmlImgs.forEach((m) => {
    const tag = m[0] || "";
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    if (!altMatch || !altMatch[1].trim()) {
      imagesWithoutAlt++;
    }
  });

  if (featuredImage) {
    totalImages++;
    if (!featuredImageAlt || !featuredImageAlt.trim()) {
      imagesWithoutAlt++;
    }
  }

  let score = 0;
  const passed: string[] = [];
  const improvements: string[] = [];

  // 1. Focus Keyword Checks
  if (cleanKeyword) {
    // In Title
    if (activeTitle.toLowerCase().includes(cleanKeyword)) {
      score += 10;
      passed.push(`Focus keyword "${cleanKeyword}" found in title`);
    } else {
      improvements.push(`Include focus keyword "${cleanKeyword}" in SEO title`);
    }

    // In Meta Description
    if (activeMeta.toLowerCase().includes(cleanKeyword)) {
      score += 10;
      passed.push(`Focus keyword found in meta description`);
    } else {
      improvements.push(`Include focus keyword in meta description`);
    }

    // In Slug
    const slugKeywordVariant = cleanKeyword.replace(/\s+/g, "-");
    const cleanAlphanumeric = cleanKeyword.replace(/[^a-z0-9]/g, "");
    const cleanSlug = activeSlug.replace(/[^a-z0-9]/g, "");
    const keywordTokens = cleanKeyword.split(/[\s/._-]+/).filter((t) => t.length > 2);
    if (
      activeSlug.includes(slugKeywordVariant) ||
      activeSlug.includes(cleanAlphanumeric) ||
      cleanSlug.includes(cleanAlphanumeric) ||
      (keywordTokens.length > 0 && keywordTokens.every((kw) => activeSlug.includes(kw) || cleanSlug.includes(kw)))
    ) {
      score += 10;
      passed.push(`Focus keyword found in URL slug`);
    } else {
      improvements.push(`Include focus keyword in URL slug (e.g. /${slugKeywordVariant})`);
    }

    // In first 100 words
    const first100Words = words.slice(0, 100).join(" ").toLowerCase();
    if (first100Words.includes(cleanKeyword)) {
      score += 8;
      passed.push(`Focus keyword appears in the first 100 words`);
    } else {
      improvements.push(`Introduce focus keyword in the opening paragraph`);
    }

    // In H2/H3 Headings
    const mdHeadingTexts = [...mdH2, ...mdH3].map((h) => h.replace(/^#{2,3}\s+/, "")).join(" ");
    const htmlHeadingTexts = [...htmlH2, ...htmlH3].map((h) => h.replace(/<[^>]*>/g, "")).join(" ");
    const allHeadingText = (mdHeadingTexts + " " + htmlHeadingTexts).toLowerCase();

    if (allHeadingText.includes(cleanKeyword)) {
      score += 8;
      passed.push(`Focus keyword found in subheadings (H2/H3)`);
    } else if (h2Count > 0) {
      improvements.push(`Include focus keyword in at least one H2 subheading`);
    }
  } else {
    improvements.push("Set a primary focus keyword to evaluate keyword optimization");
  }

  // 2. SEO Title Length
  if (activeTitle.length >= 45 && activeTitle.length <= 65) {
    score += 8;
    passed.push(`SEO Title length is optimal (${activeTitle.length} characters)`);
  } else if (activeTitle.length > 65) {
    improvements.push(`SEO Title is too long (${activeTitle.length}/60 chars) — search engines may truncate it`);
  } else if (activeTitle.length > 0 && activeTitle.length < 45) {
    improvements.push(`SEO Title is short (${activeTitle.length}/60 chars) — add descriptive benefits`);
  } else {
    improvements.push("SEO Title is missing");
  }

  // 3. Meta Description Length
  if (activeMeta.length >= 130 && activeMeta.length <= 165) {
    score += 8;
    passed.push(`Meta Description length is optimal (${activeMeta.length} characters)`);
  } else if (activeMeta.length > 165) {
    improvements.push(`Meta description is long (${activeMeta.length}/160 chars) — keep under 160 characters`);
  } else if (activeMeta.length > 0 && activeMeta.length < 130) {
    improvements.push(`Meta description is short (${activeMeta.length}/160 chars) — aim for 140–160 characters`);
  } else {
    improvements.push("Add a compelling meta description for search snippet click-throughs");
  }

  // 4. Content Depth & Length
  if (wordCount >= 900) {
    score += 15;
    passed.push(`Exceptional content depth (${wordCount} words)`);
  } else if (wordCount >= 500) {
    score += 10;
    passed.push(`Good content length (${wordCount} words)`);
  } else if (wordCount >= 250) {
    score += 5;
    improvements.push(`Content is ${wordCount} words. Aim for 600+ words for competitive technology keywords`);
  } else {
    improvements.push(`Content is thin (${wordCount} words). Add detailed sections, benefits, and tech stack details`);
  }

  // 5. Internal Links
  if (internalLinksCount >= 2) {
    score += 7;
    passed.push(`${internalLinksCount} internal links connecting related Glovax services/pages`);
  } else if (internalLinksCount === 1) {
    score += 4;
    improvements.push(`Add 1 or 2 more internal links to services, case studies, or contact`);
  } else {
    improvements.push(`Add internal links to guide users to related services or portfolio`);
  }

  // 6. External Authority Links
  if (externalLinksCount >= 1) {
    score += 3;
    passed.push(`External authority link referenced`);
  }

  // 7. Image Optimization & Alt Text
  if (totalImages > 0 && imagesWithoutAlt === 0) {
    score += 7;
    passed.push(`All ${totalImages} images have descriptive SEO alt attributes`);
  } else if (totalImages > 0 && imagesWithoutAlt > 0) {
    score += 3;
    improvements.push(`${imagesWithoutAlt} image(s) are missing alt text`);
  } else {
    improvements.push(`Add a featured image with descriptive alt text`);
  }

  // 8. Headings Hierarchy
  if (h1Count <= 1 && h2Count >= 1) {
    score += 4;
    passed.push(`Clean heading hierarchy (${h2Count} H2 sections)`);
  } else if (h1Count > 1) {
    improvements.push(`Multiple H1 tags detected in content — use only one H1 per page`);
  }

  // 9. Robots Directives
  if (robotsIndex) {
    score += 3;
    passed.push(`Search engine indexing enabled (Index, Follow)`);
  } else {
    improvements.push(`Page is set to Noindex — search engines will not index this page`);
  }

  // Determine Grade
  score = Math.min(100, Math.max(0, score));
  let grade: SeoAnalysisResult["grade"] = "Poor";
  if (score >= 85) grade = "Excellent";
  else if (score >= 70) grade = "Good";
  else if (score >= 50) grade = "Needs Improvement";

  return {
    score,
    grade,
    passed,
    improvements,
    metrics: {
      wordCount,
      charCount,
      readTimeMin,
      headingsCount: totalHeadings,
      h1Count,
      h2Count,
      h3Count,
      internalLinksCount,
      externalLinksCount,
      imagesCount: totalImages,
      imagesWithoutAltCount: imagesWithoutAlt,
    },
  };
}

export function SeoScoreCard(props: SeoScoreCardProps) {
  const result = useMemo(() => calculateSeoScore(props), [props]);

  const scoreColor =
    result.score >= 85
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : result.score >= 70
      ? "text-[#1EDAC6] border-[#1EDAC6]/30 bg-[#1EDAC6]/10"
      : result.score >= 50
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-red-400 border-red-500/30 bg-red-500/10";

  const progressBg =
    result.score >= 85
      ? "bg-emerald-400"
      : result.score >= 70
      ? "bg-[#1EDAC6]"
      : result.score >= 50
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-4">
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#1EDAC6]" />
          <h3 className="font-semibold text-white text-sm">Real-Time SEO Audit</h3>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scoreColor}`}
        >
          {result.grade.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar & Score */}
      <div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-2xl font-bold text-white tracking-tight">
            {result.score}
            <span className="text-xs font-normal text-gray-400"> / 100</span>
          </span>
          <span className="text-xs text-gray-400">
            {result.passed.length} passed · {result.improvements.length} to improve
          </span>
        </div>
        <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full ${progressBg} transition-all duration-500 rounded-full`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#1EDAC6]/10 text-center">
        <div className="bg-card/60 p-2 rounded-lg border border-white/5">
          <span className="text-xs font-bold text-white block">{result.metrics.wordCount}</span>
          <span className="text-[10px] text-gray-400">Words</span>
        </div>
        <div className="bg-card/60 p-2 rounded-lg border border-white/5">
          <span className="text-xs font-bold text-white block">{result.metrics.readTimeMin} min</span>
          <span className="text-[10px] text-gray-400">Read Time</span>
        </div>
        <div className="bg-card/60 p-2 rounded-lg border border-white/5">
          <span className="text-xs font-bold text-white block">
            {result.metrics.internalLinksCount} / {result.metrics.imagesCount}
          </span>
          <span className="text-[10px] text-gray-400">Links / Imgs</span>
        </div>
      </div>

      {/* Checklist (Passed & Improvements) */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {result.improvements.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
              Needs Improvement ({result.improvements.length})
            </span>
            {result.improvements.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-gray-300 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{tip}</span>
              </div>
            ))}
          </div>
        )}

        {result.passed.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Optimized ({result.passed.length})
            </span>
            {result.passed.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-gray-300 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
