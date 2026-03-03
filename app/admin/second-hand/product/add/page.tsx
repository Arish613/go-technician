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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}