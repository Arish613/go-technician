"use client";

import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/FormFields";
import RichTextEditor from "@/components/TextEditor";
import ImageUpload from "@/components/ImageUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { createService, updateService } from "@/lib/action/service";
import type { ServiceWithRelations } from "@/types/service";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  type: z.array(z.string()),
  isPublished: z.boolean(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.string().min(1, "Answer is required"),
    })
  ),
  subServices: z.array(
    z.object({
      name: z.string().min(1, "Sub-service name is required"),
      description: z.string().min(1, "Description is required"),
      price: z.number().min(0, "Price must be positive"),
      discountedPrice: z.number().min(0).optional(),
      type: z.string().optional(),
      imageUrl: z.string().optional(),
      whatIncluded: z.array(z.string()),
      whatExcluded: z.array(z.string()),
      duration: z.string().optional(),
      isPopular: z.boolean(),
      isActive: z.boolean(),
    })
  ),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: ServiceWithRelations;
  mode: "create" | "update";
}

export function ServiceForm({ service, mode }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newType, setNewType] = useState("");
  const [newIncludedItem, setNewIncludedItem] = useState<{
    [key: number]: string;
  }>({});
  const [newExcludedItem, setNewExcludedItem] = useState<{
    [key: number]: string;
  }>({});

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      slug: service?.slug || "",
      content: service?.content || "",
      location: service?.location || "",
      imageUrl: service?.imageUrl || "",
      type: service?.type || [],
      isPublished: service?.isPublished || false,
      faqs: service?.faqs || [],
      subServices:
        service?.subServices.map((sub) => ({
          name: sub.name,
          description: sub.description,
          price: sub.price,
          discountedPrice: sub.discountedPrice || undefined,
          type: sub.type || undefined,
          imageUrl: sub.imageUrl || undefined,
          whatIncluded: sub.whatIncluded || [],
          whatExcluded: sub.whatExcluded || [],
          duration: sub.duration || undefined,
          isPopular: sub.isPopular,
          isActive: sub.isActive,
        })) || [],
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

  const {
    fields: subServiceFields,
    append: appendSubService,
    remove: removeSubService,
  } = useFieldArray({
    control: form.control,
    name: "subServices",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      const result =
        mode === "create"
          ? await createService(data)
          : await updateService({ ...data, id: service!.id });

      if (result.success) {
        router.push("/admin/service");
        router.refresh();
      } else {
        alert(result.error || "Operation failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addType = () => {
    if (newType.trim()) {
      const currentTypes = form.getValues("type");
      if (!currentTypes.includes(newType.trim())) {
        form.setValue("type", [...currentTypes, newType.trim()]);
      }
      setNewType("");
    }
  };

  const removeType = (typeToRemove: string) => {
    const currentTypes = form.getValues("type");
    form.setValue(
      "type",
      currentTypes.filter((t) => t !== typeToRemove)
    );
  };

  const addIncludedItem = (index: number) => {
    const item = newIncludedItem[index]?.trim();
    if (item) {
      const current = form.getValues(`subServices.${index}.whatIncluded`);
      form.setValue(`subServices.${index}.whatIncluded`, [...current, item]);
      setNewIncludedItem({ ...newIncludedItem, [index]: "" });
    }
  };

  const removeIncludedItem = (subIndex: number, itemIndex: number) => {
    const current = form.getValues(`subServices.${subIndex}.whatIncluded`);
    form.setValue(
      `subServices.${subIndex}.whatIncluded`,
      current.filter((_, i) => i !== itemIndex)
    );
  };

  const addExcludedItem = (index: number) => {
    const item = newExcludedItem[index]?.trim();
    if (item) {
      const current = form.getValues(`subServices.${index}.whatExcluded`);
      form.setValue(`subServices.${index}.whatExcluded`, [...current, item]);
      setNewExcludedItem({ ...newExcludedItem, [index]: "" });
    }
  };

  const removeExcludedItem = (subIndex: number, itemIndex: number) => {
    const current = form.getValues(`subServices.${subIndex}.whatExcluded`);
    form.setValue(
      `subServices.${subIndex}.whatExcluded`,
      current.filter((_, i) => i !== itemIndex)
    );
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
              name="name"
              control={form.control}
              label="Service Name"
              placeholder="e.g., AC Service & Maintenance"
              disabled={isSubmitting}
            />

            <FormFields
              name="slug"
              control={form.control}
              label="Slug"
              placeholder="ac-service-maintenance"
              description="Auto-generated from name. Used in URL."
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
            >
              Generate Slug
            </Button>

            <FormFields
              name="description"
              control={form.control}
              label="Short Description"
              type="textarea"
              placeholder="Brief description of the service..."
              disabled={isSubmitting}
            />

            <FormFields
              name="location"
              control={form.control}
              label="Location (Optional)"
              placeholder="e.g., Jaipur, Mumbai"
              disabled={isSubmitting}
            />

            <ImageUpload
              name="imageUrl"
              control={form.control}
              label="Service Image"
              description="Upload a representative image for this service"
              disabled={isSubmitting}
              defaultValue="/service.png"
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
              <Label htmlFor="isPublished">Publish Service</Label>
            </div>
          </CardContent>
        </Card>

        {/* Service Types */}
        <Card>
          <CardHeader>
            <CardTitle>Service Types (Optional)</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add types like &quot;Split AC&quot;, &quot;Window AC&quot; if
              applicable
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g., Split AC"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addType();
                  }
                }}
                disabled={isSubmitting}
              />
              <Button
                type="button"
                onClick={addType}
                variant="outline"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.watch("type").map((type) => (
                <Badge key={type} variant="secondary" className="px-3 py-1">
                  {type}
                  <button
                    type="button"
                    onClick={() => removeType(type)}
                    className="ml-2 hover:text-destructive"
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Content</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              name="content"
              control={form.control}
              label="Service Content"
              placeholder="Detailed information about the service..."
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
                variant="outline"
                size="sm"
                onClick={() => appendFaq({ question: "", answer: "" })}
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
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

        {/* Sub Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sub Services</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendSubService({
                    name: "",
                    description: "",
                    price: 0,
                    discountedPrice: undefined,
                    type: undefined,
                    imageUrl: undefined,
                    whatIncluded: [],
                    whatExcluded: [],
                    duration: undefined,
                    isPopular: false,
                    isActive: true,
                  })
                }
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sub Service
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {subServiceFields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sub-services added yet. Click &quot;Add Sub Service&quot; to
                get started.
              </p>
            ) : (
              subServiceFields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-6 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-lg">
                      Sub Service #{index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubService(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFields
                      name={`subServices.${index}.name`}
                      control={form.control}
                      label="Name"
                      placeholder="e.g., AC Jet Service"
                      disabled={isSubmitting}
                    />

                    <FormFields
                      name={`subServices.${index}.type`}
                      control={form.control}
                      label="Type (Optional)"
                      type="select"
                      options={form.watch("type").map((t) => ({
                        label: t,
                        value: t,
                      }))}
                      placeholder="Select type"
                      disabled={isSubmitting}
                    />
                  </div>

                  <FormFields
                    name={`subServices.${index}.description`}
                    control={form.control}
                    label="Description"
                    type="textarea"
                    placeholder="Brief description"
                    disabled={isSubmitting}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFields
                      name={`subServices.${index}.price`}
                      control={form.control}
                      label="Price (₹)"
                      type="number"
                      placeholder="599"
                      disabled={isSubmitting}
                    />

                    <FormFields
                      name={`subServices.${index}.discountedPrice`}
                      control={form.control}
                      label="Discounted Price (₹)"
                      type="number"
                      placeholder="499"
                      disabled={isSubmitting}
                    />

                    <FormFields
                      name={`subServices.${index}.duration`}
                      control={form.control}
                      label="Duration"
                      placeholder="45 mins"
                      disabled={isSubmitting}
                    />
                  </div>

                  <ImageUpload
                    name={`subServices.${index}.imageUrl`}
                    control={form.control}
                    label="Sub Service Image"
                    disabled={isSubmitting}
                  />

                  {/* What's Included */}
                  <div className="space-y-2">
                    <Label>What&#39;s Included</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newIncludedItem[index] || ""}
                        onChange={(e) =>
                          setNewIncludedItem({
                            ...newIncludedItem,
                            [index]: e.target.value,
                          })
                        }
                        placeholder="e.g., Cleaning of AC filters"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addIncludedItem(index);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={() => addIncludedItem(index)}
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form
                        .watch(`subServices.${index}.whatIncluded`)
                        .map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="secondary">
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                removeIncludedItem(index, itemIndex)
                              }
                              className="ml-2 hover:text-destructive"
                              disabled={isSubmitting}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* What's Excluded */}
                  <div className="space-y-2">
                    <Label>What&#39;s Excluded</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newExcludedItem[index] || ""}
                        onChange={(e) =>
                          setNewExcludedItem({
                            ...newExcludedItem,
                            [index]: e.target.value,
                          })
                        }
                        placeholder="e.g., Spare parts cost"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addExcludedItem(index);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        onClick={() => addExcludedItem(index)}
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {form
                        .watch(`subServices.${index}.whatExcluded`)
                        .map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="destructive">
                            {item}
                            <button
                              type="button"
                              onClick={() =>
                                removeExcludedItem(index, itemIndex)
                              }
                              className="ml-2 hover:text-white"
                              disabled={isSubmitting}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`isPopular-${index}`}
                        checked={form.watch(`subServices.${index}.isPopular`)}
                        onCheckedChange={(checked) =>
                          form.setValue(
                            `subServices.${index}.isPopular`,
                            checked
                          )
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`isPopular-${index}`}>Popular</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`isActive-${index}`}
                        checked={form.watch(`subServices.${index}.isActive`)}
                        onCheckedChange={(checked) =>
                          form.setValue(
                            `subServices.${index}.isActive`,
                            checked
                          )
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`isActive-${index}`}>Active</Label>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() =>
                appendSubService({
                  name: "",
                  description: "",
                  price: 0,
                  discountedPrice: undefined,
                  type: undefined,
                  imageUrl: undefined,
                  whatIncluded: [],
                  whatExcluded: [],
                  duration: undefined,
                  isPopular: false,
                  isActive: true,
                })
              }
              disabled={isSubmitting}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sub Service
            </Button>
          </CardContent>

        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/service")}
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
              "Create Service"
            ) : (
              "Update Service"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
