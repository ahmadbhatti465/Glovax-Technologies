"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PortfolioItem } from "@/types";
import { PortfolioEditor } from "@/components/admin/portfolio/PortfolioEditor";
import { Loader2 } from "lucide-react";

export default function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { loading: authLoading } = useAuth(true);
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`/api/admin/portfolio/${id}`, { credentials: "include" });
        if (!res.ok) {
          setError("Failed to load portfolio item");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setItem(data);
      } catch {
        setError("Error loading portfolio item");
      }
      setLoading(false);
    }

    if (!authLoading) {
      loadItem();
    }
  }, [id, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#1EDAC6]" />
        <span className="text-xs">Loading Portfolio CMS…</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-gray-400 gap-4 p-6 text-center">
        <p className="text-sm text-red-400 font-semibold">{error || "Project not found"}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/portfolio")}
          className="px-4 py-2 bg-surface-raised border border-[#1EDAC6]/30 text-[#1EDAC6] text-xs font-semibold rounded-lg hover:bg-card transition-colors"
        >
          Return to Portfolio Management
        </button>
      </div>
    );
  }

  return <PortfolioEditor initialItem={item} isNew={false} />;
}
