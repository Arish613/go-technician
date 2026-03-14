"use client";

import { useEffect, useState } from "react";
import { ProductForm } from "@/components/second-hand/ProductForm";

export default function AddProduct() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/second-hand/category")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="text-center py-10">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      <p className="text-muted-foreground mt-2">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-8">
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}