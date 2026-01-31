"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SubService } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Star, Loader2 } from "lucide-react";
import { getReviewsBySubService } from "@/lib/action/review";

interface Review {
    id: string;
    rating: string;
    reviewer: string;
    comment: string;
    imageUrl?: string | null;
    createdAt: Date;
}

interface SubServiceDialogProps {
    subService: SubService;
}

export function SubServiceDialog({ subService }: SubServiceDialogProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            fetchReviews();
        }
    }, [open]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await getReviewsBySubService(subService.id);
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + Number(review.rating), 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Info className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="md:max-w-2xl overflow-y-auto  max-h-[90vh]">
                <DialogHeader>
                    {subService.imageUrl && (
                        <Image
                            src={subService.imageUrl}
                            alt={subService.name}
                            width={400}
                            height={300}
                            className="rounded-lg object-cover mx-auto"
                        />
                    )}
                    <DialogTitle>{subService.name}</DialogTitle>
                    <DialogDescription>{subService.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* What's Included/Excluded */}
                    <div className="space-y-4">
                        {subService.whatIncluded.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <span className="text-green-600">✓</span> What&apos;s Included
                                </h4>
                                <ul className="space-y-1.5">
                                    {subService.whatIncluded.map((item, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {subService.whatExcluded.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <span className="text-red-600">✗</span> What&apos;s Not Included
                                </h4>
                                <ul className="space-y-1.5">
                                    {subService.whatExcluded.map((item, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-red-600 mt-0.5">•</span>
                                            <span className="text-muted-foreground">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    {reviews.length > 0 && (
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-base">Customer Reviews</h4>
                                {reviews.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="ml-1 font-semibold">{averageRating}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border rounded-lg p-4 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < Number(review.rating)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-semibold text-sm">
                                                        {review.reviewer}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {review.comment}
                                            </p>
                                            {review.imageUrl && (
                                                <Image
                                                    src={review.imageUrl}
                                                    alt="Review"
                                                    width={150}
                                                    height={100}
                                                    className="rounded-md object-cover mt-2"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}