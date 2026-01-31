"use client";

import { use, useEffect, useState } from "react";
import { BlogForm } from "@/components/blog/Form";
import { notFound } from "next/navigation";
import { BlogWithFaqs } from "@/types/blog";
import { Loader2 } from "lucide-react";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<BlogWithFaqs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch blog");
        }
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="md:mx-20 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="md:mx-20 py-8">
        <div className="text-center py-10">
          <p className="text-destructive">{error || "Blog not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mx-20 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <BlogForm blog={blog} mode="edit" />
    </div>
  );
}