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
import { getServices } from "@/lib/action/service";
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
    serviceId: z.string().min(1, "Service is required"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    review?: Review;
    mode: "create" | "update";
    onSuccess?: () => void;
}

export function ReviewForm({ review, mode, onSuccess }: ReviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serviceOptions, setServiceOptions] = useState<{ label: string; value: string }[]>([]);
    const router = useRouter();
    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: review?.rating || "5",
            comment: review?.comment || "",
            imageUrl: review?.imageUrl || "",
            reviewer: review?.reviewer || "",
            serviceId: review?.serviceId || "",
        },
    });

    // Fetch services for dropdown
    useEffect(() => {
        (async () => {
            const res = await getServices();
            if (res.success && Array.isArray(res.data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const options = res.data.map((s: any) => ({
                    label: s.name,
                    value: s.id,
                }));

                setServiceOptions(options);
            }
        })();
    }, []);

    const onSubmit = async (data: ReviewFormData) => {
        setIsSubmitting(true);
        try {
            if (mode === "create") {
                await createReview(data);
                alert("Review created successfully!");
                router.push("/admin/review");
            } else if (review) {
                await updateReview(review.id, data);
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
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Custom Select Field for Service */}
                    <FieldGroup>
                        <FieldLabel>Service</FieldLabel>
                        <Select
                            value={form.watch("serviceId")}
                            onValueChange={(value) => form.setValue("serviceId", value)}
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
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : mode === "create" ? "Add Review" : "Update Review"}
            </Button>
        </form>
    );
}