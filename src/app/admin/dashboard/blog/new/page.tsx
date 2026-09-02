"use client";

import { useAuth } from "@/hooks/useAuth";
import { BlogPostEditor } from "@/components/admin/blog/BlogPostEditor";

export default function NewBlogPost() {
  const { loading } = useAuth(true);
  if (loading) return <div className="min-h-screen bg-background" />;

  return <BlogPostEditor isNew={true} />;
}
