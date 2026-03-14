"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
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
  whyChooseUs: z
    .array(
      z.object({
        icon: z.string().optional(),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
      })
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
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
      whyChooseUs: category?.whyChooseUs || [],
      faqs: category?.faqs || [],
    },
  });
  // Why Choose Us field array
  const {
    fields: whyChooseUsFields,
    append: appendWhyChooseUs,
    remove: removeWhyChooseUs,
  } = useFieldArray({
    control: form.control,
    name: "whyChooseUs",
  });

  // FAQ field array
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Why Choose Us</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendWhyChooseUs({ icon: "", title: "", description: "" })}
                >
                  Add
                </Button>
              </div>
              {whyChooseUsFields.length === 0 && (
                <div className="text-muted-foreground text-sm mb-2">No items yet.</div>
              )}
              {whyChooseUsFields.map((field, idx) => (
                <div key={field.id} className="border rounded p-3 mb-3 space-y-2 relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => removeWhyChooseUs(idx)}
                  >
                    ✕
                  </Button>
                  <FormFields
                    name={`whyChooseUs.${idx}.icon`}
                    control={form.control}
                    label="Icon (optional)"
                    placeholder="e.g., star"
                    disabled={isSubmitting}
                  />
                  <FormFields
                    name={`whyChooseUs.${idx}.title`}
                    control={form.control}
                    label="Title"
                    placeholder="e.g., Trusted Technicians"
                    disabled={isSubmitting}
                  />
                  <FormFields
                    name={`whyChooseUs.${idx}.description`}
                    control={form.control}
                    label="Description"
                    placeholder="e.g., All our technicians are background checked."
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>FAQs</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendFaq({ question: "", answer: "" })}
                >
                  Add
                </Button>
              </div>
              {faqFields.length === 0 && (
                <div className="text-muted-foreground text-sm mb-2">No FAQs yet.</div>
              )}
              {faqFields.map((field, idx) => (
                <div key={field.id} className="border rounded p-3 mb-3 space-y-2 relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => removeFaq(idx)}
                  >
                    ✕
                  </Button>
                  <FormFields
                    name={`faqs.${idx}.question`}
                    control={form.control}
                    label="Question"
                    placeholder="e.g., What is the warranty period?"
                    disabled={isSubmitting}
                  />
                  <FormFields
                    name={`faqs.${idx}.answer`}
                    control={form.control}
                    label="Answer"
                    placeholder="e.g., 6 months warranty on all products."
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>

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