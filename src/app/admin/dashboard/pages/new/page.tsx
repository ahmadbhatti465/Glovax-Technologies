"use client";

import { useAuth } from "@/hooks/useAuth";
import { PageEditor } from "@/components/admin/pages/PageEditor";

export default function NewPage() {
  const { loading } = useAuth(true);
  if (loading) return <div className="min-h-screen bg-background" />;

  return <PageEditor isNew={true} />;
}
