"use client";

import { CategoryForm } from "@/components/second-hand/CategoryForm";

export default function AddCategory() {
  return (
    <div className="max-w-xl mx-auto py-8">
      <CategoryForm mode="create" />
    </div>
  );
}