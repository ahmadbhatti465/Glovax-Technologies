"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Page } from "@/types";
import { PageEditor } from "@/components/admin/pages/PageEditor";
import { useRouter } from "next/navigation";

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading: authLoading } = useAuth(true);
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/pages/${id}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        } else {
          router.push("/admin/dashboard/pages");
        }
      } catch {
        router.push("/admin/dashboard/pages");
      }
      setLoading(false);
    }
    if (!authLoading) {
      load();
    }
  }, [id, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-gray-400 text-xs">
        Loading editor…
      </div>
    );
  }

  if (!page) return null;

  return <PageEditor initialPage={page} isNew={false} />;
}
