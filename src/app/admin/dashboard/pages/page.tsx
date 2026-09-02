"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PagesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard/blog");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-xs text-gray-400">
      Redirecting to Blog SEO CMS…
    </div>
  );
}
