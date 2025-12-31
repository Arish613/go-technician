"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/FormFields";
import RichTextEditor from "@/components/TextEditor";
import ImageUpload from "@/components/ImageUpload";
import { createBlog, updateBlog } from "@/lib/action/blog";
import { CreateBlogInput, UpdateBlogInput, BlogWithFaqs } from "@/types/blog";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const blogSchema = z.object({
  h1: z.string().min(1, "H1 is required"),
  title: z.string().optional(),
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().min(1, "Image is required"),
  imageCaption: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().optional(),
  Summary: z.string().optional(),
  schema: z.string().optional(),
  canonicalUrl: z.string().optional(),
  isPublished: z.boolean(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  blog?: BlogWithFaqs;
  mode?: "create" | "edit";
}

export function BlogForm({ blog, mode = "create" }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState(blog?.faqs || []);

  const methods = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog
      ? {
          h1: blog.h1,
          title: blog.title || "",
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          slug: blog.slug,
          imageUrl: blog.imageUrl,
          imageCaption: blog.imageCaption || "",
          content: blog.content,
          authorName: blog.authorName || "",
          Summary: blog.Summary || "",
          schema: blog.schema || "",
          canonicalUrl: blog.canonicalUrl || "",
          isPublished: blog.isPublished ?? false,
          faqs: blog.faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        }
      : {
          h1: "",
          title: "",
          metaTitle: "",
          metaDescription: "",
          slug: "",
          imageUrl: "",
          imageCaption: "",
          content: "",
          authorName: "",
          Summary: "",
          schema: "",
          canonicalUrl: "",
          isPublished: false,
          faqs: [],
        },
  });

  const { control, handleSubmit, setValue, watch } = methods;

  // Auto-generate slug from h1
  const h1Value = watch("h1");
  const handleH1Change = (value: string) => {
    setValue("h1", value);
    if (mode === "create") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", slug);
    }
  };

  const addFaq = () => {
    const currentFaqs = watch("faqs") || [];
    setValue("faqs", [...currentFaqs, { question: "", answer: "" }]);
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        blogId: null,
        serviceId: null,
      },
    ]);
  };

  const removeFaq = (index: number) => {
    const currentFaqs = watch("faqs") || [];
    setValue(
      "faqs",
      currentFaqs.filter((_, i) => i !== index)
    );
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: BlogFormData) => {
    setLoading(true);
    try {
      if (mode === "edit" && blog) {
        const updateData: UpdateBlogInput = {
          id: blog.id,
          ...data,
        };
        const result = await updateBlog(updateData);

        if (result.success) {
          alert("Blog updated successfully!");
          router.push("/admin/blog");
          router.refresh();
        } else {
          alert(result.error || "Failed to update blog");
        }
      } else {
        const createData: CreateBlogInput = data;
        const result = await createBlog(createData);

        if (result.success) {
          alert("Blog created successfully!");
          router.push("/admin/blog");
          router.refresh();
        } else {
          alert(result.error || "Failed to create blog");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFields
              name="h1"
              control={control}
              label="H1 Heading"
              placeholder="Enter main heading"
              description="Main heading for the blog post"
            />

            <FormFields
              name="title"
              control={control}
              label="Title (Optional)"
              placeholder="Enter page title"
            />

            <FormFields
              name="slug"
              control={control}
              label="Slug"
              placeholder="blog-post-url"
              description="URL-friendly version of the title"
              disabled={mode === "edit"}
            />

            <FormFields
              name="authorName"
              control={control}
              label="Author Name (Optional)"
              placeholder="Enter author name"
            />

            <FormFields
              name="Summary"
              control={control}
              label="Summary (Optional)"
              placeholder="Brief summary of the blog"
              type="textarea"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFields
              name="metaTitle"
              control={control}
              label="Meta Title"
              placeholder="SEO title"
              description="Title that appears in search results"
            />

            <FormFields
              name="metaDescription"
              control={control}
              label="Meta Description"
              placeholder="SEO description"
              type="textarea"
              description="Description that appears in search results"
            />

            <FormFields
              name="canonicalUrl"
              control={control}
              label="Canonical URL (Optional)"
              placeholder="https://example.com/blog/post"
            />

            <FormFields
              name="schema"
              control={control}
              label="Schema Markup (Optional)"
              placeholder="Enter JSON-LD schema"
              type="textarea"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              name="imageUrl"
              control={control}
              label="Featured Image"
              description="Upload featured image for the blog"
            />

            <FormFields
              name="imageCaption"
              control={control}
              label="Image Caption (Optional)"
              placeholder="Enter image caption"
            />

            <RichTextEditor
              name="content"
              control={control}
              label="Blog Content"
              placeholder="Write your blog content here..."
              description="Main content of the blog post"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>FAQs (Optional)</CardTitle>
            <Button type="button" onClick={addFaq} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(watch("faqs") || []).map((_, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">FAQ {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaq(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <FormFields
                    name={`faqs.${index}.question`}
                    control={control}
                    label="Question"
                    placeholder="Enter FAQ question"
                  />
                  <FormFields
                    name={`faqs.${index}.answer`}
                    control={control}
                    label="Answer"
                    placeholder="Enter FAQ answer"
                    type="textarea"
                  />
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...methods.register("isPublished")}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Publish Blog</span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "edit" ? "Updating..." : "Creating..."}
              </>
            ) : mode === "edit" ? (
              "Update Blog"
            ) : (
              "Create Blog"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
