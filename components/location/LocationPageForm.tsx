"use client";

import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/FormFields";
import RichTextEditor from "@/components/TextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LOCATIONS = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Thane", value: "thane" },
  { label: "Navi Mumbai", value: "navi-mumbai" },
];

interface ServiceOption {
  label: string;
  value: string;
}

const locationPageSchema = z.object({
  serviceSlug: z.string().min(1, "Service slug is required"),
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Title is required"),
  metaTitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  isPublished: z.boolean(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ),
});

type LocationPageFormData = z.infer<typeof locationPageSchema>;

interface LocationPageFormProps {
  mode: "create" | "update";
  locationPage?: {
    id: string;
    slug: string;
    serviceSlug: string;
    location: string;
    title: string;
    metaTitle: string | null;
    description: string;
    content: string;
    isPublished: boolean;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export function LocationPageForm({ mode, locationPage }: LocationPageFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const form = useForm<LocationPageFormData>({
    resolver: zodResolver(locationPageSchema),
    defaultValues: {
      serviceSlug: locationPage?.serviceSlug || "",
      location: locationPage?.location || "",
      title: locationPage?.title || "",
      metaTitle: locationPage?.metaTitle || "",
      description: locationPage?.description || "",
      content: locationPage?.content || "",
      isPublished: locationPage?.isPublished || false,
      faqs: locationPage?.faqs || [],
    },
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/service");
        const result = await response.json();
        if (response.ok && result.data) {
          setServiceOptions(
            result.data.map((s: { name: string; slug: string }) => ({
              label: s.name,
              value: s.slug,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setIsLoadingServices(false);
      }
    }
    fetchServices();
  }, []);

  const generateSlug = () => {
    const serviceSlug = form.getValues("serviceSlug");
    const location = form.getValues("location");
    if (serviceSlug && location) {
      return `${serviceSlug}-in-${location}`;
    }
    return "";
  };

  const generateTitle = () => {
    const serviceSlug = form.getValues("serviceSlug");
    const location = form.getValues("location");
    if (serviceSlug && location) {
      const serviceName =
        serviceOptions.find((o) => o.value === serviceSlug)?.label ||
        serviceSlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      const locationName = location
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return `${serviceName} in ${locationName}`;
    }
    return "";
  };

  const onSubmit = async (data: LocationPageFormData) => {
    setIsSubmitting(true);
    try {
      const slug = generateSlug();
      const payload = {
        ...data,
        slug,
      };

      if (mode === "create") {
        const response = await fetch("/api/location-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          router.push("/admin/location-pages");
          router.refresh();
        } else {
          alert(result.error || "Failed to create location page");
        }
      } else {
        const response = await fetch(
          `/api/location-page/${locationPage!.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();

        if (response.ok) {
          router.push("/admin/location-pages");
          router.refresh();
        } else {
          alert(result.error || "Failed to update location page");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormFields
              name="serviceSlug"
              control={form.control}
              label="Service"
              type="select"
              options={serviceOptions}
              placeholder={isLoadingServices ? "Loading services..." : "Select a service"}
              description="The parent service this location page belongs to"
              disabled={isSubmitting || isLoadingServices || mode === "update"}
            />

            <FormFields
              name="location"
              control={form.control}
              label="Location"
              type="select"
              options={LOCATIONS}
              placeholder="Select location"
              disabled={isSubmitting || mode === "update"}
            />

            <div className="p-3 bg-muted rounded-md text-sm">
              <span className="font-medium">Generated slug: </span>
              <code className="text-primary">
                {generateSlug() || "Fill service slug & location"}
              </code>
            </div>

            <FormFields
              name="title"
              control={form.control}
              label="Page Title"
              placeholder="e.g., AC Repair Service in Mumbai"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const title = generateTitle();
                if (title) {
                  form.setValue("title", title);
                }
              }}
            >
              Auto-generate Title
            </Button>

            <FormFields
              name="metaTitle"
              control={form.control}
              label="Meta Title (Optional)"
              placeholder="SEO meta title for the page"
              disabled={isSubmitting}
            />

            <FormFields
              name="description"
              control={form.control}
              label="Description (Meta Description)"
              type="textarea"
              placeholder="Brief description of the service in this location..."
              disabled={isSubmitting}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublished"
                checked={form.watch("isPublished")}
                onCheckedChange={(checked) =>
                  form.setValue("isPublished", checked)
                }
                disabled={isSubmitting}
              />
              <Label htmlFor="isPublished">Publish Page</Label>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Location-Specific Content</CardTitle>
            <p className="text-sm text-muted-foreground">
              Rich text content unique to this location page (for SEO)
            </p>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              name="content"
              control={form.control}
              label="Page Content"
              placeholder="Detailed information about the service in this location..."
              disabled={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>FAQs</CardTitle>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => appendFaq({ question: "", answer: "" })}
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Location-specific frequently asked questions
            </p>
          </CardHeader>
          <CardContent className="space-y-6 md:grid md:grid-cols-2 gap-3">
            {faqFields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
              </p>
            ) : (
              faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">FAQ #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaq(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <FormFields
                    name={`faqs.${index}.question`}
                    control={form.control}
                    label="Question"
                    placeholder="Enter FAQ question"
                    disabled={isSubmitting}
                  />
                  <FormFields
                    name={`faqs.${index}.answer`}
                    control={form.control}
                    label="Answer"
                    type="textarea"
                    placeholder="Enter FAQ answer"
                    disabled={isSubmitting}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/location-pages")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Location Page"
            ) : (
              "Update Location Page"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
