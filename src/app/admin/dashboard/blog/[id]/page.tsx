"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost } from "@/types";
import { BlogPostEditor } from "@/components/admin/blog/BlogPostEditor";
import { useRouter } from "next/navigation";

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { loading: authLoading } = useAuth(true);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/blog/${id}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          router.push("/admin/dashboard/blog");
        }
      } catch {
        router.push("/admin/dashboard/blog");
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
        Loading article editor…
      </div>
    );
  }

  if (!post) return null;

  return <BlogPostEditor initialPost={post} isNew={false} />;
}
