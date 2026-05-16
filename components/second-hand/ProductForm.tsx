"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FormFields from "@/components/FormFields";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import type { City, Locality } from "@/types/location";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  condition: z.string().optional(),
  specifications: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0).optional(),
  isAvailable: z.boolean(),
  image: z.string().optional(),
  cityId: z.string().optional(),
  localityId: z.string().optional(),
  brand: z.string().optional(),
  label: z.string().optional(),
  starRating: z.string().optional(),
  description: z.string().optional(),
  whatsIncluded: z.array(z.string()).optional(),
  additionalInfo: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema> & { id?: string };

interface ProductFormProps {
  product?: Partial<ProductFormData>;
  mode: "create" | "update";
  categories: { id: string; name: string; slug: string }[];
}

export function ProductForm({ product, mode, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>(
    product?.cityId || "",
  );
  const [newWhatsIncludedItem, setNewWhatsIncludedItem] = useState("");
  const [newAdditionalInfoItem, setNewAdditionalInfoItem] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [citiesRes, locsRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/localities"),
        ]);
        const citiesData = await citiesRes.json();
        const locsData = await locsRes.json();
        if (citiesData.data) setCities(citiesData.data);
        if (locsData.data) setLocalities(locsData.data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (product?.localityId && localities.length > 0) {
      const loc = localities.find((l) => l.id === product.localityId);
      if (loc) setSelectedCityId(loc.cityId);
    }
  }, [localities, product?.localityId]);

  const filteredLocalities = selectedCityId
    ? localities.filter((l) => l.cityId === selectedCityId)
    : [];

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
      cityId: product?.cityId || "",
      localityId: product?.localityId || "",
      brand: product?.brand || "",
      label: product?.label || "",
      starRating: product?.starRating || undefined,
      description: product?.description || "",
      whatsIncluded: product?.whatsIncluded || [],
      additionalInfo: product?.additionalInfo || [],
    },
  });
  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const isACCategory =
    selectedCategory?.slug === "buy-second-hand-air-conditioner";

  // Watch for cityId changes and update selectedCityId and localityId accordingly
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "cityId") {
        setSelectedCityId(value.cityId || "");
        form.setValue("localityId", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const addWhatsIncludedItem = () => {
    const item = newWhatsIncludedItem.trim();
    if (item) {
      const current = form.getValues("whatsIncluded") || [];
      form.setValue("whatsIncluded", [...current, item]);
      setNewWhatsIncludedItem("");
    }
  };

  const removeWhatsIncludedItem = (index: number) => {
    const current = form.getValues("whatsIncluded") || [];
    form.setValue(
      "whatsIncluded",
      current.filter((_, i) => i !== index),
    );
  };

  const addAdditionalInfoItem = () => {
    const item = newAdditionalInfoItem.trim();
    if (item) {
      const current = form.getValues("additionalInfo") || [];
      form.setValue("additionalInfo", [...current, item]);
      setNewAdditionalInfoItem("");
    }
  };

  const removeAdditionalInfoItem = (index: number) => {
    const current = form.getValues("additionalInfo") || [];
    form.setValue(
      "additionalInfo",
      current.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        starRating: data.starRating ? Number(data.starRating) : undefined,
      };
      const url =
        mode === "create"
          ? "/api/second-hand/product"
          : `/api/second-hand/product/${product?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        router.push("/admin/second-hand/product");
        router.refresh();
      } else {
        alert(result.error || "Failed to save product");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
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
            <FormFields
              name="name"
              control={form.control}
              label="Name*"
              placeholder="e.g., Used LG Inverter AC"
              disabled={isSubmitting}
            />
            <FormFields
              name="description"
              control={form.control}
              label="Description"
              placeholder="Provide a detailed description of the product"
              disabled={isSubmitting}
              type="textarea"
            />

            <FormFields
              name="categoryId"
              control={form.control}
              label="Category*"
              type="select"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Select category"
              disabled={isSubmitting}
            />
            <FormFields
              name="condition"
              control={form.control}
              label="Condition"
              placeholder="e.g., Used - Like New"
              disabled={isSubmitting}
            />
            <FormFields
              name="specifications"
              control={form.control}
              label="Specifications"
              placeholder="e.g., 1.5 Ton, 5 Star, Inverter"
              disabled={isSubmitting}
            />
            <div className="flex gap-5">
              <FormFields
                name="price"
                control={form.control}
                label="Price*"
                type="number"
                placeholder="e.g., 15000"
                disabled={isSubmitting}
              />
              <FormFields
                name="discountPrice"
                control={form.control}
                label="Discount Price"
                type="number"
                placeholder="e.g., 12000"
                disabled={isSubmitting}
              />
            </div>
            <ImageUpload
              name="image"
              control={form.control}
              label="Product Image"
              disabled={isSubmitting}
              defaultValue="/service.png"
            />
            <div className="flex gap-5">
              <FormFields
                name="cityId"
                control={form.control}
                label="City"
                type="select"
                options={cities
                  .filter((c) => c.isActive)
                  .map((city) => ({
                    value: city.id,
                    label: city.name,
                  }))}
                placeholder="Select city"
                disabled={isSubmitting}
              />
              <FormFields
                name="localityId"
                control={form.control}
                label="Locality"
                type="select"
                options={filteredLocalities
                  .filter((l) => l.isActive)
                  .map((loc) => ({
                    value: loc.id,
                    label: loc.name,
                  }))}
                placeholder="Select locality"
                disabled={isSubmitting || !selectedCityId}
              />
              {isACCategory && (
                <FormFields
                  name="starRating"
                  control={form.control}
                  label="Star Rating"
                  type="select"
                  options={[
                    { value: "1", label: "1 Star" },
                    { value: "2", label: "2 Star" },
                    { value: "3", label: "3 Star" },
                    { value: "4", label: "4 Star" },
                    { value: "5", label: "5 Star" },
                  ]}
                  placeholder="Select AC star rating"
                  disabled={isSubmitting}
                />
              )}
            </div>
            {/* What's Included */}
            <div className="space-y-2">
              <Label>What&apos;s Included</Label>
              <div className="flex gap-2">
                <Input
                  value={newWhatsIncludedItem}
                  onChange={(e) => setNewWhatsIncludedItem(e.target.value)}
                  placeholder="e.g., Power Cable, Remote, Warranty Card"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addWhatsIncludedItem();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={addWhatsIncludedItem}
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch("whatsIncluded") || []).map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeWhatsIncludedItem(index)}
                      className="ml-2 hover:text-destructive"
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {/* Additional Info */}
            <div className="space-y-2">
              <Label>Additional Info</Label>
              <div className="flex gap-2">
                <Input
                  value={newAdditionalInfoItem}
                  onChange={(e) => setNewAdditionalInfoItem(e.target.value)}
                  placeholder="e.g., 1 year warranty, 3 months old, tested by technician"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAdditionalInfoItem();
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  onClick={addAdditionalInfoItem}
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch("additionalInfo") || []).map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAdditionalInfoItem(index)}
                      className="ml-2 hover:text-destructive"
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-5">
              <FormFields
                name="brand"
                control={form.control}
                label="Brand"
                placeholder="e.g., LG"
                disabled={isSubmitting}
              />
              <FormFields
                name="label"
                control={form.control}
                label="Label"
                placeholder="e.g., Best Seller"
                disabled={isSubmitting}
              />
            </div>

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
