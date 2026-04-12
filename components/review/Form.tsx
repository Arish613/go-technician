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
import { getCategories } from "@/lib/action/product";
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
    categoryId: z.string().optional(),
}).refine(
    (data) => data.serviceId || data.categoryId,
    { message: "Please select either a Service or a Category", path: ["root"] }
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
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
    const [loadingSubServices, setLoadingSubServices] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryFetchError, setCategoryFetchError] = useState(false);
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
            categoryId: review?.categoryId || "",
        },
    });

    const selectedServiceId = form.watch("serviceId");
    const selectedCategoryId = form.watch("categoryId");

    // Fetch services and categories for dropdowns
    useEffect(() => {
        (async () => {
            const [servicesRes, categoriesRes] = await Promise.all([
                getServices(),
                getCategories(),
            ]);

            if (servicesRes.success && Array.isArray(servicesRes.data)) {
                const options = servicesRes.data.map((s: { name: string; id: string }) => ({
                    label: s.name,
                    value: s.id,
                }));
                setServiceOptions(options);
            }

            if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
                const options = categoriesRes.data.map((c: { name: string; id: string }) => ({
                    label: c.name,
                    value: c.id,
                }));
                setCategoryOptions(options);
            } else {
                setCategoryFetchError(true);
            }

            setLoadingCategories(false);
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

    // Mutual exclusivity: clear category when service is selected
    useEffect(() => {
        if (selectedServiceId && selectedCategoryId) {
            form.setValue("categoryId", "");
        }
    }, [selectedServiceId, selectedCategoryId, form]);

    // Mutual exclusivity: clear service when category is selected
    useEffect(() => {
        if (selectedCategoryId && selectedServiceId) {
            form.setValue("serviceId", "");
            form.setValue("subServiceId", "");
            setSubServiceOptions([]);
        }
    }, [selectedCategoryId, selectedServiceId, form]);

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
                productId: null,
                categoryId: data.categoryId || null,
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
                <CardHeader>
                    <CardTitle>{mode === "create" ? "Add Review" : "Edit Review"}</CardTitle>
                    <span className="text-muted-foreground text-xs">Can&apos;t select both service and category</span>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                            {/* Category Select - mutually exclusive with Service */}
                            <FieldGroup>
                                <FieldLabel>Category</FieldLabel>
                                {categoryFetchError ? (
                                    <p className="text-sm text-destructive">Failed to load categories. Please refresh.</p>
                                ) : (
                                    <Select
                                        value={form.watch("categoryId")}
                                        onValueChange={(value) => form.setValue("categoryId", value)}
                                        disabled={isSubmitting || loadingCategories}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a category"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoryOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {form.formState.errors.categoryId && (
                                    <FieldError>{form.formState.errors.categoryId.message}</FieldError>
                                )}
                            </FieldGroup>
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
