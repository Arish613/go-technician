"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReview, updateReview } from "@/lib/action/review";
import type { Review } from "@/types/review";
import FormFields from "@/components/FormFields";
import { getServices, getSubServiceForGivenService } from "@/lib/action/service";
import { getProducts } from "@/lib/action/product";
import {
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const reviewSchema = z.object({
    rating: z.string().min(1, "Rating is required").max(5, "Rating cannot exceed 5"),
    comment: z.string().min(1, "Comment is required"),
    imageUrl: z.string().optional(),
    reviewer: z.string().min(1, "Reviewer name is required"),
    serviceId: z.string().optional(),
    subServiceId: z.string().optional(),
    productId: z.string().optional(),
}).refine(
    (data) => data.serviceId || data.productId,
    { message: "Please select either a Service or a Product", path: ["root"] }
);

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    review?: Review;
    mode: "create" | "update";
    onSuccess?: () => void;
}

export function ReviewForm({ review, mode, onSuccess }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serviceOptions, setServiceOptions] = useState<{ label: string; value: string }[]>([]);
    const [subServiceOptions, setSubServiceOptions] = useState<{ label: string; value: string }[]>([]);
    const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
    const [loadingSubServices, setLoadingSubServices] = useState(false);
    const router = useRouter();

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: review?.rating || "5",
            comment: review?.comment || "",
            imageUrl: review?.imageUrl || "",
            reviewer: review?.reviewer || "",
            serviceId: review?.serviceId || "",
            subServiceId: review?.subServiceId ?? "",
            productId: review?.productId || "",
        },
    });

    const selectedServiceId = form.watch("serviceId");
    const selectedProductId = form.watch("productId");

    // Fetch services and products for dropdowns
    useEffect(() => {
        (async () => {
            const [servicesRes, productsRes] = await Promise.all([
                getServices(),
                getProducts(),
            ]);

            if (servicesRes.success && Array.isArray(servicesRes.data)) {
                const options = servicesRes.data.map((s: { name: string; id: string }) => ({
                    label: s.name,
                    value: s.id,
                }));
                setServiceOptions(options);
            }

            if (productsRes.success && Array.isArray(productsRes.data)) {
                const options = productsRes.data.map((p: { name: string; id: string; category: { name: string } }) => ({
                    label: `${p.name} (${p.category?.name || "Uncategorized"})`,
                    value: p.id,
                }));
                setProductOptions(options);
            }
        })();
    }, []);

    // Fetch subservices when service is selected
    useEffect(() => {
        if (!selectedServiceId) {
            setSubServiceOptions([]);
            form.setValue("subServiceId", "");
            return;
        }

        (async () => {
            setLoadingSubServices(true);
            try {
                const result = await getSubServiceForGivenService(selectedServiceId);
                if (result && result.success && result.data) {
                    const options = result.data.map((ss) => ({
                        label: ss.name,
                        value: ss.id,
                    }));
                    setSubServiceOptions(options);
                } else {
                    setSubServiceOptions([]);
                }
            } catch (error) {
                console.error("Error fetching subservices:", error);
                setSubServiceOptions([]);
            } finally {
                setLoadingSubServices(false);
            }
        })();
    }, [selectedServiceId, form]);

    // Clear product when service is selected, and vice versa (mutual exclusivity)
    useEffect(() => {
        if (selectedServiceId && selectedProductId) {
            form.setValue("productId", "");
        }
    }, [selectedServiceId, selectedProductId, form]);

    useEffect(() => {
        if (selectedProductId && selectedServiceId) {
            form.setValue("serviceId", "");
            form.setValue("subServiceId", "");
            setSubServiceOptions([]);
        }
    }, [selectedProductId, selectedServiceId, form]);

    const onSubmit = async (data: ReviewFormData) => {
        setIsSubmitting(true);
        try {
            const reviewData = {
                rating: data.rating,
                comment: data.comment,
                imageUrl: data.imageUrl || null,
                reviewer: data.reviewer,
                serviceId: data.serviceId || null,
                subServiceId: data.subServiceId || null,
                productId: data.productId || null,
                categoryId: null,
            };

            if (mode === "create") {
                await createReview(reviewData);
                alert("Review created successfully!");
                router.push("/admin/review");
            } else if (review) {
                await updateReview(review.id, reviewData);
                alert("Review updated successfully!");
                router.push("/admin/review");
            }
            if (onSuccess) onSuccess();
            form.reset();
        } catch (error) {
            console.error(error);
            alert("Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader >
                    <CardTitle>{mode === "create" ? "Add Review" : "Edit Review"}</CardTitle>
                    <span className="text-muted-foreground text-xs">Can&apos;t select both service and product</span>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2">
                        <div className="space-y-4">
                            {/* Service Select */}
                            <FieldGroup>
                                <FieldLabel>Service</FieldLabel>
                                <Select
                                    value={form.watch("serviceId")}
                                    onValueChange={(value) => {
                                        form.setValue("serviceId", value);
                                        form.setValue("subServiceId", "");
                                    }}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.formState.errors.serviceId && (
                                    <FieldError>{form.formState.errors.serviceId.message}</FieldError>
                                )}
                            </FieldGroup>

                            {/* SubService Select - Only show if service is selected */}
                            {selectedServiceId && (
                                <FieldGroup>
                                    <FieldLabel>Sub Service (Optional)</FieldLabel>
                                    <Select
                                        value={form.watch("subServiceId") || "none"}
                                        onValueChange={(value) => form.setValue("subServiceId", value === "none" ? "" : value)}
                                        disabled={isSubmitting || loadingSubServices}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                loadingSubServices
                                                    ? "Loading..."
                                                    : subServiceOptions.length === 0
                                                        ? "No sub-services available"
                                                        : "Select a sub-service (optional)"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None (Service-level review)</SelectItem>
                                            {subServiceOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.subServiceId && (
                                        <FieldError>{form.formState.errors.subServiceId.message}</FieldError>
                                    )}
                                </FieldGroup>
                            )}
                        </div>
                        <div>

                            {/* Product Select - mutually exclusive with Service */}
                            {productOptions.length > 0 && (
                                <FieldGroup>
                                    <FieldLabel>Product (Optional)</FieldLabel>
                                    <Select
                                        value={form.watch("productId")}
                                        onValueChange={(value) => form.setValue("productId", value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FieldGroup>
                            )}
                        </div>
                    </div>
                    <FormFields
                        name="rating"
                        control={form.control}
                        label="Rating"
                        placeholder="Enter Rating (1-5)"
                        disabled={isSubmitting}
                    />

                    <FormFields
                        name="reviewer"
                        control={form.control}
                        label="Reviewer Name"
                        placeholder="Your name"
                        disabled={isSubmitting}
                    />
                    <FormFields
                        name="comment"
                        control={form.control}
                        label="Comment"
                        type="textarea"
                        placeholder="Write your review..."
                        disabled={isSubmitting}
                    />
                    <FormFields
                        name="imageUrl"
                        control={form.control}
                        label="Image URL (optional)"
                        placeholder="https://example.com/photo.jpg"
                        disabled={isSubmitting}
                    />
                </CardContent>
            </Card>
            {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : mode === "create" ? "Add Review" : "Update Review"}
            </Button>
        </form>
    );
}