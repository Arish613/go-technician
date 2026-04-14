"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createProductReview } from "@/lib/action/review";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must not exceed 1000 characters"),
  reviewer: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewFormProps {
  productId: string | null;
  categoryId: string | null;
  onSuccess?: () => void;
}

export function ProductReviewForm({ productId, categoryId, onSuccess }: ProductReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const router = useRouter();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      reviewer: "",
    },
  });

  const selectedRating = form.watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await createProductReview({
        ...data,
        rating: data.rating.toString(),
        productId,
        categoryId,
      });

      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
      {/* Star Rating */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Your Rating <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => form.setValue("rating", star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || selectedRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-slate-200 text-slate-200"
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-sm text-slate-600">
            {selectedRating > 0 && (
              <>
                {selectedRating === 5 && "Excellent"}
                {selectedRating === 4 && "Very Good"}
                {selectedRating === 3 && "Good"}
                {selectedRating === 2 && "Fair"}
                {selectedRating === 1 && "Poor"}
              </>
            )}
          </span>
        </div>
        {form.formState.errors.rating && (
          <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>
        )}
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-medium">
          Your Review <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this product..."
          className="min-h-30 resize-none"
          {...form.register("comment")}
        />
        {form.formState.errors.comment && (
          <p className="text-sm text-red-500">{form.formState.errors.comment.message}</p>
        )}
        <p className="text-xs text-slate-400 text-right">
          {form.watch("comment")?.length || 0}/1000
        </p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="reviewer" className="text-sm font-medium">
          Your Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="reviewer"
          placeholder="Enter your name"
          {...form.register("reviewer")}
        />
        {form.formState.errors.reviewer && (
          <p className="text-sm text-red-500">{form.formState.errors.reviewer.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
