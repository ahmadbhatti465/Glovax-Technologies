"use client";

import { useAuth } from "@/hooks/useAuth";
import { PortfolioEditor } from "@/components/admin/portfolio/PortfolioEditor";

export default function NewPortfolioPage() {
  const { loading } = useAuth(true);

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  return <PortfolioEditor isNew={true} />;
}
