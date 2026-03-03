"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/second-hand/CategoryForm";
import type { Category } from "@/types/product";

export default function EditCategoryPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/second-hand/category/${slug}`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="text-center py-10">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      <p className="text-muted-foreground mt-2">Loading...</p>
    </div>
  );
  if (!category) return <div>Category not found</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <CategoryForm mode="update" category={category} />
    </div>
  );
}