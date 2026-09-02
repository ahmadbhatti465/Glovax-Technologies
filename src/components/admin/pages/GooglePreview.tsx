"use client";

import { useState } from "react";
import { Monitor, Smartphone, Globe } from "lucide-react";
import { siteConfig } from "@/lib/constants";

interface GooglePreviewProps {
  title: string;
  slug: string;
  seoTitle?: string;
  metaDescription?: string;
}

export function GooglePreview({
  title,
  slug,
  seoTitle,
  metaDescription,
}: GooglePreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayTitle = seoTitle || title || "Page Title — Glovax Technologies";
  const displaySlug = slug || "example-page";
  const displayUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/${displaySlug}`;
  const displayMeta =
    metaDescription ||
    "Glovax Technologies provides world-class software development, web & mobile applications, AI solutions, and digital growth services.";

  return (
    <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#1EDAC6]" />
          <h3 className="font-semibold text-white text-sm">Google Search Snippet</h3>
        </div>
        <div className="flex items-center bg-card rounded-lg p-0.5 border border-[#1EDAC6]/20">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded text-xs transition-colors ${
              device === "desktop"
                ? "bg-[#1EDAC6] text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
            title="Desktop SERP"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1 rounded text-xs transition-colors ${
              device === "mobile"
                ? "bg-[#1EDAC6] text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
            title="Mobile SERP"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Google SERP Simulated Card */}
      <div
        className={`bg-[#202124] rounded-xl p-4 border border-white/10 text-left font-sans transition-all ${
          device === "mobile" ? "max-w-xs mx-auto text-xs" : "w-full text-sm"
        }`}
      >
        {/* Favicon & Breadcrumb */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-[#1EDAC6]/20 border border-[#1EDAC6]/40 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-[#1EDAC6]">G</span>
          </div>
          <div className="truncate">
            <span className="text-xs text-white block leading-tight font-medium">
              {siteConfig.name}
            </span>
            <span className="text-[11px] text-[#bdc1c6] truncate block leading-tight">
              https://{displayUrl}
            </span>
          </div>
        </div>

        {/* SEO Title Link */}
        <h4 className="text-[#8ab4f8] hover:underline text-base font-normal leading-snug cursor-pointer mb-1 line-clamp-2">
          {displayTitle}
        </h4>

        {/* Meta Description */}
        <p className="text-[#bdc1c6] text-xs leading-relaxed line-clamp-2">
          {displayMeta}
        </p>
      </div>

      <div className="flex justify-between text-[11px] text-gray-400 pt-1">
        <span>Title: {displayTitle.length} chars (Target: 50–60)</span>
        <span>Meta: {displayMeta.length} chars (Target: 140–160)</span>
      </div>
    </div>
  );
}
