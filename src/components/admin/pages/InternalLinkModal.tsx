"use client";

import { useState, useEffect } from "react";
import { X, Search, Link2, ExternalLink, Globe, Check } from "lucide-react";
import { InternalLinkTarget } from "@/types";

interface InternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (linkData: {
    text: string;
    url: string;
    openInNewTab: boolean;
    rel: string;
  }) => void;
  selectedText?: string;
}

export function InternalLinkModal({
  isOpen,
  onClose,
  onInsert,
  selectedText = "",
}: InternalLinkModalProps) {
  const [text, setText] = useState(selectedText);
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [nofollow, setNofollow] = useState(false);
  const [sponsored, setSponsored] = useState(false);
  const [ugc, setUgc] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<InternalLinkTarget[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setText(selectedText);
      setUrl("");
      setOpenInNewTab(false);
      setNofollow(false);
      setSponsored(false);
      setUgc(false);
      setQuery("");
      fetchSuggestions("");
    }
  }, [isOpen, selectedText]);

  const fetchSuggestions = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/internal-links?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSelectSuggestion = (target: InternalLinkTarget) => {
    setUrl(target.url);
    if (!text) {
      setText(target.title);
    }
    // Internal links shouldn't normally open in new tab
    if (target.url.startsWith("/")) {
      setOpenInNewTab(false);
      setNofollow(false);
    } else {
      setOpenInNewTab(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const relParts: string[] = [];
    if (openInNewTab) relParts.push("noopener", "noreferrer");
    if (nofollow) relParts.push("nofollow");
    if (sponsored) relParts.push("sponsored");
    if (ugc) relParts.push("ugc");

    onInsert({
      text: text.trim() || url.trim(),
      url: url.trim(),
      openInNewTab,
      rel: relParts.join(" "),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-raised border border-[#1EDAC6]/20 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1EDAC6]/10">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Link2 className="w-4 h-4 text-[#1EDAC6]" />
            <span>Insert Link</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Link Text (Anchor Text)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Professional Web Development Services"
              className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#1EDAC6]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Destination URL <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/web-development or https://example.com"
                required
                className="w-full px-3 py-2 bg-card border border-[#1EDAC6]/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#1EDAC6]"
              />
              {url.startsWith("http") && (
                <ExternalLink className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>

          {/* Internal Content Search Suggestions */}
          <div className="pt-2 border-t border-[#1EDAC6]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#1EDAC6] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Search Internal Pages & Content
              </span>
              <span className="text-[11px] text-gray-500">Click any result to insert</span>
            </div>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search services, portfolio, blog, or pages..."
                className="w-full pl-8 pr-3 py-1.5 bg-card/60 border border-[#1EDAC6]/10 rounded-md text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1EDAC6]/50"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 rounded-lg border border-[#1EDAC6]/10 p-1.5 bg-background/50">
              {loading ? (
                <div className="text-xs text-gray-500 py-3 text-center">Searching content…</div>
              ) : suggestions.length === 0 ? (
                <div className="text-xs text-gray-500 py-3 text-center">No matching content found.</div>
              ) : (
                suggestions.map((item, idx) => {
                  const isSelected = url === item.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between text-xs transition-colors ${
                        isSelected
                          ? "bg-[#1EDAC6]/20 text-[#1EDAC6] border border-[#1EDAC6]/30"
                          : "hover:bg-white/5 text-gray-300"
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="ml-2 text-gray-500 text-[11px] font-mono">{item.url}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                          {item.category}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#1EDAC6]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Link Options */}
          <div className="pt-2 border-t border-[#1EDAC6]/10 space-y-2">
            <span className="text-xs font-medium text-gray-400 block mb-1">SEO & Link Attributes</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                />
                <span>Open in new tab</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nofollow}
                  onChange={(e) => setNofollow(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                />
                <span>Add rel=&quot;nofollow&quot;</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sponsored}
                  onChange={(e) => setSponsored(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                />
                <span>Add rel=&quot;sponsored&quot;</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ugc}
                  onChange={(e) => setUgc(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1EDAC6] rounded"
                />
                <span>Add rel=&quot;ugc&quot; (User Content)</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-[#1EDAC6]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-4 py-2 bg-[#1EDAC6] hover:bg-[#34F5E2] text-black text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Insert Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
