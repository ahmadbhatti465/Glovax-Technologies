"use client";

import { X, History, User, Clock, FileText } from "lucide-react";
import { PageVersion } from "@/types";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions?: PageVersion[];
  pageTitle: string;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  versions = [],
  pageTitle,
}: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-surface-raised border border-[#1EDAC6]/20 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1EDAC6]/10">
          <div className="flex items-center gap-2 text-white font-semibold">
            <History className="w-4 h-4 text-[#1EDAC6]" />
            <span>Version History — {pageTitle}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {versions.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-xs">
              No version history recorded yet. Edits will create version snapshots automatically.
            </div>
          ) : (
            versions
              .slice()
              .reverse()
              .map((ver, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-card border border-[#1EDAC6]/15 hover:border-[#1EDAC6]/40 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1EDAC6] bg-[#1EDAC6]/10 px-2 py-0.5 rounded">
                      v{ver.version}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span>{new Date(ver.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ver.title}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-500" />
                      <span>{ver.author || "Admin"}</span>
                    </div>
                    {ver.note && <span className="italic text-gray-400">{ver.note}</span>}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-[#1EDAC6]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-card hover:bg-card-hover border border-white/10 text-xs text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
