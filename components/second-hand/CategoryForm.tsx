"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import TextEditor from "@/components/TextEditor";
import FormFields from "@/components/FormFields";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  image: z.string().optional(),
  isVisible: z.boolean(),
  content: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;


interface CategoryFormProps {
  category?: Partial<CategoryFormData>;
  mode: "create" | "update";
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      metaTitle: category?.metaTitle || "",
      metaDescription: category?.metaDescription || "",
      image: category?.image || "",
      isVisible: category?.isVisible ?? true,
      content: category?.content || "",
    },
  });

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const url =
        mode === "create"
          ? "/api/second-hand/category"
          : `/api/second-hand/category/${category?.slug}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        router.push("/admin/second-hand/category");
        router.refresh();
      } else {
        alert(result.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error submitting category form:", error);
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
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Name*</label>
              <input
                {...form.register("name", {
                  onBlur: (e) => {
                    const name = e.target.value;
                    if (name && !form.getValues("slug")) {
                      form.setValue("slug", generateSlug(name));
                    }
                  },
                })}
                placeholder="e.g., AC"
                disabled={isSubmitting}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex gap-2 items-end">
              <FormFields
                name="slug"
                control={form.control}
                label="Slug*"
                placeholder="ac"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const name = form.getValues("name");
                  if (name) {
                    form.setValue("slug", generateSlug(name));
                  }
                }}
                disabled={isSubmitting}
              >
                Generate Slug
              </Button>
            </div>
            <FormFields
              name="metaTitle"
              control={form.control}
              label="Meta Title"
              placeholder="Meta title for SEO"
              disabled={isSubmitting}
            />
            <FormFields
              name="metaDescription"
              control={form.control}
              label="Meta Description"
              placeholder="Meta description for SEO"
              disabled={isSubmitting}
            />
            <ImageUpload
              name="image"
              control={form.control}
              label="Category Image"
              disabled={isSubmitting}
              defaultValue="/service.png"
            />
            <TextEditor
              name="content"
              control={form.control}
              label="Category Content"
              placeholder="Write detailed information about this category..."
              disabled={isSubmitting}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={form.watch("isVisible")}
                onCheckedChange={(checked) =>
                  form.setValue("isVisible", checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="isVisible">Visible</Label>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/second-hand/category")}
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
                ? "Create Category"
                : "Update Category"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}