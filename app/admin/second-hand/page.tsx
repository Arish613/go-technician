"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminSecondHandPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Second Hand Admin</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-xl font-semibold">Categories</h2>
            <p className="text-muted-foreground">Manage product categories</p>
          </div>
          <Link href="/admin/second-hand/category">
            <Button>Go to Categories</Button>
          </Link>
        </div>
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-muted-foreground">Manage second-hand products</p>
          </div>
          <Link href="/admin/second-hand/product">
            <Button>Go to Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}