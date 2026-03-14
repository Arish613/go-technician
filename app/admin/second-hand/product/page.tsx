"use client";

import { useEffect, useState } from "react";
import { ProductTable } from "@/components/second-hand/ProductTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";
import type { Product } from "@/types/product";

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/second-hand/product");
      const result = await response.json();

      if (response.ok && result.data) {
        setProducts(result.data);
      } else {
        setError(result.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("An error occurred while fetching products");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="md:mx-20 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage your second-hand products
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchProducts}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Link href="/admin/second-hand/product/add">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Product
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
          <p className="text-muted-foreground mt-2">Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchProducts} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      ) : products.length > 0 ? (
        <ProductTable products={products} onRefresh={fetchProducts} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}