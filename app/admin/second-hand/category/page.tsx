"use client";

import { useEffect, useState } from "react";
import { CategoryTable } from "@/components/second-hand/CategoryTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, RefreshCw, ArrowLeft } from "lucide-react";
import type { Category } from "@/types/product";

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/second-hand/category");
      const result = await response.json();

      if (response.ok && result.data) {
        setCategories(result.data);
      } else {
        setError(result.error || "Failed to fetch categories");
      }
    } catch (err) {
      setError("An error occurred while fetching categories");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your product categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchCategories}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/second-hand/category/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <Link href="/admin/second-hand">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-muted-foreground mt-2">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchCategories} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : categories.length > 0 ? (
        <CategoryTable categories={categories} onRefresh={fetchCategories} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No categories found</p>
        </div>
      )}
    </div>
  );
}