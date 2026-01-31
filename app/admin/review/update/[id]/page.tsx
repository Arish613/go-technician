"use client";

import { ReviewForm } from "@/components/review/Form";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
    id: string;
    rating: number;
    reviewer: string;
    comment: string;
    imageUrl?: string | null;
    serviceId: string;
    subServiceId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function UpdateReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReview() {
            try {
                const response = await fetch(`/api/service/review/${id}`);
                if (!response.ok) throw new Error("Failed to fetch review");
                const data = await response.json();

                if (!data) {
                    notFound();
                }

                setReview(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchReview();
    }, [id]);

    if (loading) {
        return (
            <div className="md:mx-20 py-8 px-4 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !review) {
        return (
            <div className="md:mx-20 py-8 px-4">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive">{error || "Review not found"}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="md:mx-20 py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Update Review</h1>
                <p className="text-muted-foreground">
                    Edit review details
                </p>
            </div>
            <ReviewForm
                mode="update"
                review={{
                    ...review,
                    rating: String(review.rating),
                    imageUrl: review.imageUrl === null ? undefined : review.imageUrl,
                    subServiceId: review.subServiceId,
                }}
            />
        </div>
    );
}