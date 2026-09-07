"use client";

import { useState } from "react";
import Image from "next/image";
import { Share2, Twitter, ImageIcon } from "lucide-react";
import { siteConfig } from "@/lib/constants";

interface SocialPreviewProps {
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export function SocialPreview({
  title,
  seoTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SocialPreviewProps) {
  const [platform, setPlatform] = useState<"og" | "twitter">("og");

  const displayTitle =
    (platform === "og" ? ogTitle : twitterTitle) ||
    seoTitle ||
    title ||
    "Glovax Technologies — Software House";

  const displayDescription =
    (platform === "og" ? ogDescription : twitterDescription) ||
    metaDescription ||
    siteConfig.description;

  const displayImage =
    (platform === "og" ? ogImage : twitterImage) ||
    siteConfig.ogImage;

  const domain = siteConfig.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="bg-surface-raised border border-[#1EDAC6]/15 rounded-xl p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#1EDAC6]" />
          <h3 className="font-semibold text-white text-sm">Social Media Card Preview</h3>
        </div>
        <div className="flex items-center bg-card rounded-lg p-0.5 border border-[#1EDAC6]/20">
          <button
            type="button"
            onClick={() => setPlatform("og")}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              platform === "og"
                ? "bg-[#1EDAC6] text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            OpenGraph
          </button>
          <button
            type="button"
            onClick={() => setPlatform("twitter")}
            className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
              platform === "twitter"
                ? "bg-[#1EDAC6] text-black font-semibold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Twitter className="w-3 h-3" /> X / Twitter
          </button>
        </div>
      </div>

      {/* Social Card */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-card shadow-md">
        {/* Card Image */}
        <div className="w-full aspect-[1.91/1] bg-black/40 relative overflow-hidden flex items-center justify-center">
          {displayImage ? (
            <Image
              src={displayImage.startsWith("/") || displayImage.startsWith("http") || displayImage.startsWith("data:") ? displayImage : `/${displayImage}`}
              alt={displayTitle}
              fill
              sizes="500px"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-gray-500">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">1200 × 630 px</span>
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="p-3 bg-surface border-t border-white/5 space-y-1">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-mono">
            {domain}
          </span>
          <h4 className="text-xs font-semibold text-white line-clamp-1">
            {displayTitle}
          </h4>
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 text-center">
        Optimal social card image dimension is 1200 × 630 pixels.
      </p>
    </div>
  );
}
