"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SERVICE_LABELS } from "@/lib/lead-schemas";

interface Lead {
  id: string;
  source: string;
  name: string | null;
  email: string;
  company: string | null;
  service: string | null;
  message: string | null;
  emailStatus: string;
  emailError: string | null;
  createdAt: string;
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "contact", label: "Contact form" },
  { value: "chat", label: "Chat" },
  { value: "hero", label: "Homepage" },
  { value: "newsletter", label: "Newsletter" },
];

const SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  FILTERS.filter((filter) => filter.value !== "all").map((filter) => [filter.value, filter.label])
);

const EMAIL_STATUS: Record<string, { label: string; className: string }> = {
  sent: { label: "Email sent", className: "text-emerald-400" },
  failed: { label: "Email failed", className: "text-red-400" },
  skipped: { label: "Email not configured", className: "text-amber-400" },
  pending: { label: "Email pending", className: "text-gray-400" },
};

export default function AdminLeadsPage() {
  const { loading } = useAuth(true);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (loading) return;
    fetch("/api/admin/leads", { credentials: "include" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load leads");
        return response.json();
      })
      .then(setLeads)
      .catch(() => setLoadFailed(true));
  }, [loading]);

  if (loading) return <div className="min-h-screen bg-background" />;

  const visible = (leads ?? []).filter((lead) => filter === "all" || lead.source === filter);

  return (
    <div className="min-h-screen bg-background text-white">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-2">Leads</h1>
        <p className="text-gray-400 text-sm mb-6">
          Every contact form, chat, homepage and newsletter submission, newest first.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                filter === value
                  ? "border-[#1EDAC6] text-[#1EDAC6]"
                  : "border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loadFailed && <p className="text-sm text-red-400">Could not load leads. Please refresh the page.</p>}
        {!loadFailed && leads === null && <p className="text-sm text-gray-400">Loading…</p>}
        {!loadFailed && leads !== null && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
            <Inbox className="w-8 h-8" aria-hidden />
            <p className="text-sm">No submissions yet.</p>
          </div>
        )}

        <ul className="space-y-4">
          {visible.map((lead) => {
            const status = EMAIL_STATUS[lead.emailStatus] ?? EMAIL_STATUS.pending;
            const service = SERVICE_LABELS[lead.service as keyof typeof SERVICE_LABELS] ?? lead.service;
            return (
              <li key={lead.id} className="bg-surface-raised border border-[#1EDAC6]/10 rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1">
                  <div className="min-w-0">
                    {lead.name && <p className="font-semibold">{lead.name}</p>}
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#1EDAC6] break-all"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden /> {lead.email}
                    </a>
                  </div>
                  <div className="text-xs text-gray-400 text-right">
                    <p>{new Date(lead.createdAt).toLocaleString()}</p>
                    <p>{SOURCE_LABELS[lead.source] ?? lead.source}</p>
                    <p className={status.className} title={lead.emailError ?? undefined}>{status.label}</p>
                  </div>
                </div>
                {(lead.company || service) && (
                  <p className="text-xs text-gray-400 mt-3">
                    {[lead.company, service].filter(Boolean).join(" · ")}
                  </p>
                )}
                {lead.message && (
                  <p className="text-sm text-gray-200 mt-3 whitespace-pre-wrap break-words">{lead.message}</p>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
