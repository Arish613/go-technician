"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  condition: z.string().optional(),
  specifications: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
  image: z.string().optional(),
  location: z.string().optional(),
  brand: z.string().optional(),
  label: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema> & { id?: string };

interface ProductFormProps {
  product?: Partial<ProductFormData>;
  mode: "create" | "update";
  categories: { id: string; name: string }[];
}

export function ProductForm({ product, mode, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      categoryId: product?.categoryId || "",
      condition: product?.condition || "",
      specifications: product?.specifications || "",
      price: product?.price || 0,
      discountPrice: product?.discountPrice || undefined,
      isAvailable: product?.isAvailable ?? true,
      image: product?.image || "",
      location: product?.location || "",
      brand: product?.brand || "",
      label: product?.label || "",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/second-hand/product"
          : `/api/second-hand/product/${product?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        router.push("/admin/second-hand/product");
        router.refresh();
      } else {
        alert(result.error || "Failed to save product");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Name</Label>
            <Input
              {...form.register("name")}
              disabled={isSubmitting}
              placeholder="e.g., Used LG Inverter AC"
            />
            <Label>Category</Label>
            <select
              {...form.register("categoryId")}
              disabled={isSubmitting}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Label>Condition</Label>
            <Input
              {...form.register("condition")}
              disabled={isSubmitting}
              placeholder="e.g., Used - Like New"
            />
            <Label>Specifications</Label>
            <Input
              {...form.register("specifications")}
              disabled={isSubmitting}
              placeholder="e.g., 1.5 Ton, 5 Star, Inverter"
            />
            <Label>Price</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("price", { valueAsNumber: true })}
              disabled={isSubmitting}
              placeholder="e.g., 15000"
            />
            <Label>Discount Price</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("discountPrice", { valueAsNumber: true })}
              disabled={isSubmitting}
              placeholder="e.g., 12000"
            />
            <ImageUpload
              name="image"
              control={form.control}
              label="Product Image"
              disabled={isSubmitting}
              defaultValue="/service.png"
            />
            <Label>Location</Label>
            <Input
              {...form.register("location")}
              disabled={isSubmitting}
              placeholder="e.g., Mumbai"
            />
            <Label>Brand</Label>
            <Input
              {...form.register("brand")}
              disabled={isSubmitting}
              placeholder="e.g., LG"
            />
            <Label>Label</Label>
            <Input
              {...form.register("label")}
              disabled={isSubmitting}
              placeholder="e.g., Best Seller"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={form.watch("isAvailable")}
                onCheckedChange={(checked) =>
                  form.setValue("isAvailable", checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/second-hand/product")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Product"
              : "Update Product"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}