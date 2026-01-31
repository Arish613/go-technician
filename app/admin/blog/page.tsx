"use client";

import { useEffect, useState } from "react";
import { BlogsTable } from "@/components/blog/BlogTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { BlogWithFaqs } from "@/types/blog";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogWithFaqs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blog");
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="md:mx-20 py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:mx-20 py-8">
        <div className="text-center py-10">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Blogs</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Link href="/admin/blog/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No blogs found</p>
        </div>
      ) : (
        <BlogsTable blogs={blogs} />
      )}
    </div>
  );
}