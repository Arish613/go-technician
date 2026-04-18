"use client";

import { useForm, useFieldArray, FormProvider, Controller } from "react-hook-form";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldContent,
  FieldError,
} from "@/components/ui/field";

interface ServiceOption {
  label: string;
  value: string;
}

interface LocalityOption {
  label: string;
  value: string; // locality slug
}

interface CityOption {
  label: string;
  value: string; // city slug
  localities: LocalityOption[];
}

const locationPageSchema = z.object({
  serviceSlug: z.string().min(1, "Service slug is required"),
  location: z.string().min(1, "City is required"), // city slug
  locality: z.string().optional(), // locality slug (optional)
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
    location: string; // city slug
    locality?: string | null; // locality slug (optional)
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
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [localityOptions, setLocalityOptions] = useState<LocalityOption[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<LocationPageFormData>({
    resolver: zodResolver(locationPageSchema),
    defaultValues: {
      serviceSlug: locationPage?.serviceSlug || "",
      location: locationPage?.location || "", // city slug
      locality: locationPage?.locality || "_none_", // locality slug
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
    async function fetchData() {
      try {
        const [servicesRes, citiesRes] = await Promise.all([
          fetch("/api/service"),
          fetch("/api/cities"),
        ]);

        const servicesResult = await servicesRes.json();
        const citiesResult = await citiesRes.json();

        if (servicesRes.ok && servicesResult.data) {
          setServiceOptions(
            servicesResult.data.map((s: { name: string; slug: string }) => ({
              label: s.name,
              value: s.slug,
            }))
          );
        }

        if (citiesRes.ok && citiesResult.data) {
          const mapped: CityOption[] = citiesResult.data.map(
            (c: {
              name: string;
              slug: string;
              localities: { name: string; slug: string }[];
            }) => ({
              label: c.name,
              value: c.slug,
              localities: (c.localities || []).map((l) => ({
                label: l.name,
                value: l.slug,
              })),
            })
          );
          setCityOptions(mapped);

          // In update mode, populate locality dropdown based on stored location
          if (mode === "update" && locationPage?.location) {
            const matchedCity = mapped.find((c) => c.value === locationPage.location);
            if (matchedCity) {
              setLocalityOptions(matchedCity.localities);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCityChange = (citySlug: string) => {
    const city = cityOptions.find((c) => c.value === citySlug);
    const localities = city?.localities || [];
    setLocalityOptions(localities);
    form.setValue("location", citySlug);
    form.setValue("locality", "_none_"); // reset locality when city changes
    form.trigger("location");
  };

  const handleLocalityChange = (value: string) => {
    const localitySlug = value === "_none_" ? null : value;
    form.setValue("locality", localitySlug);
  };

  const generateSlug = () => {
    const serviceSlug = form.getValues("serviceSlug");
    const location = form.getValues("location");
    const locality = form.getValues("locality");

    if (!serviceSlug || !location) return "";

    // Use locality slug if present, else city slug
    const urlSlug = (locality && locality !== "_none_") ? locality : location;
    return `${serviceSlug}-in-${urlSlug}`;
  };

  const generateTitle = () => {
    const serviceSlug = form.getValues("serviceSlug");
    const location = form.getValues("location");
    const locality = form.getValues("locality");

    if (!serviceSlug || !location) return "";

    const serviceName =
      serviceOptions.find((o) => o.value === serviceSlug)?.label ||
      serviceSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const city = cityOptions.find((c) => c.value === location);
    const cityName = city?.label || location;

    if (locality && locality !== "_none_") {
      const localityObj = city?.localities.find((l) => l.value === locality);
      const localityName =
        localityObj?.label ||
        locality
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      return `${serviceName} in ${localityName}, ${cityName}`;
    }

    return `${serviceName} in ${cityName}`;
  };

  const onSubmit = async (data: LocationPageFormData) => {
    setIsSubmitting(true);
    try {
      const slug = generateSlug();
      const payload = {
        ...data,
        slug,
      };

      const url =
        mode === "create"
          ? "/api/location-page"
          : `/api/location-page/${locationPage!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/location-pages");
        router.refresh();
      } else {
        alert(
          result.error ||
          `Failed to ${mode === "create" ? "create" : "update"} location page`
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedLocation = form.watch("location");
  const watchedLocality = form.watch("locality");

  const selectedCity = cityOptions.find((c) => c.value === watchedLocation);
  const selectedLocality = selectedCity?.localities.find(
    (l) => l.value === watchedLocality
  );

  const locationLabel = selectedLocality
    ? `${selectedLocality.label}, ${selectedCity?.label}`
    : selectedCity?.label || "";

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
              placeholder={
                isLoadingData ? "Loading services..." : "Select a service"
              }
              description="The parent service this location page belongs to"
              disabled={isSubmitting || isLoadingData || mode === "update"}
            />

            {/* City Dropdown */}
            <Controller
              name="location"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel>City</FieldLabel>
                  <FieldContent>
                    <Select
                      value={watchedLocation || ""}
                      onValueChange={handleCityChange}
                      disabled={isSubmitting || isLoadingData || mode === "update"}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {selectedCity?.label ||
                            (isLoadingData ? "Loading cities..." : "Select a city")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {cityOptions.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={fieldState.error ? [fieldState.error] : []}
                    />
                  </FieldContent>
                </Field>
              )}
            />

            {/* Locality Dropdown — shown only when city has localities */}
            {watchedLocation && localityOptions.length > 0 && (
              <Controller
                name="locality"
                control={form.control}
                render={({ fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Locality (Optional)</FieldLabel>
                    <FieldContent>
                      <Select
                        value={watchedLocality || "_none_"}
                        onValueChange={handleLocalityChange}
                        disabled={isSubmitting || mode === "update"}
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {selectedLocality?.label || "Select a locality (optional)"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none_">
                            None (City-level page)
                          </SelectItem>
                          {localityOptions.map((loc) => (
                            <SelectItem key={loc.value} value={loc.value}>
                              {loc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Leave blank to create a city-level page
                      </FieldDescription>
                      <FieldError
                        errors={fieldState.error ? [fieldState.error] : []}
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            )}

            {watchedLocation &&
              localityOptions.length === 0 &&
              !isLoadingData && (
                <p className="text-xs text-muted-foreground">
                  No localities found for this city. A city-level page will be
                  created.
                </p>
              )}

            {/* Slug preview */}
            <div className="p-3 bg-muted rounded-md text-sm space-y-1">
              {locationLabel && (
                <div>
                  <span className="font-medium">Location: </span>
                  <span className="text-primary">{locationLabel}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Generated slug: </span>
                <code className="text-primary">
                  {generateSlug() || "Fill service & city above"}
                </code>
              </div>
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
                if (title) form.setValue("title", title);
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
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
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
