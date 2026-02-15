"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { Star, StarHalf, User } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  rating: string;
  comment: string;
  imageUrl: string | null;
  reviewer: string;
  createdAt: Date;
}

interface ReviewsListProps {
  reviews: Review[];
  serviceName: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (rating >= i + 1) {
          return (
            <Star
              key={i}
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
            />
          );
        } else if (rating > i && rating < i + 1) {
          return (
            <StarHalf
              key={i}
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
            />
          );
        } else {
          return (
            <Star
              key={i}
              className="h-4 w-4 fill-slate-200 text-slate-200"
            />
          );
        }
      })}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rating = Number(review.rating);
  const comment = review.comment;
  const shouldTruncate = comment.length > 200;
  const displayComment = isExpanded || !shouldTruncate
    ? comment
    : `${comment.slice(0, 200)}...`;

  return (
    <div
      className="animate-in slide-in-from-bottom-4 fade-in duration-500 "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="group bg-white border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                {review.reviewer.charAt(0).toUpperCase()}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {review.reviewer}
                </h4>
                <p className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-slate-900">{rating}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="mb-3">
            <StarRating rating={rating} />
          </div>

          {/* Comment */}
          <div className="mb-4">
            <p className="text-slate-700 leading-relaxed">
              &quot;{displayComment}&quot;
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 text-sm font-medium mt-2 hover:underline"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Image */}
          {review.imageUrl && (
            <div className="mb-4">
              <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-100">
                <CldImage
                  src={review.imageUrl}
                  alt={`Review by ${review.reviewer}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

export function ReviewsList({ reviews, serviceName }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No reviews yet
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Be the first to share your experience with {serviceName}. Your feedback helps others make informed decisions!
        </p>
      </div>
    );
  }

  return (
    <div className="grid  md:grid-cols-3 gap-6 ">
      {reviews.map((review, index) => (
        <ReviewCard key={review.id} review={review} index={index} />
      ))}
    </div>
  );
}
