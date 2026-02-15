"use client";

import { Star } from "lucide-react";

interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface RatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}

export function RatingSummary({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: RatingSummaryProps) {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Left Side - Average Rating */}
      <div className="text-center md:text-left">
        <div className="flex items-baseline justify-center md:justify-start gap-2 mb-2">
          <span className="text-5xl md:text-6xl font-bold">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-xl text-blue-200">/5</span>
        </div>
        
        {/* Stars */}
        <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i < fullStars
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-white/20 text-white/40"
              }`}
            />
          ))}
        </div>
        
        <p className="text-blue-100">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Right Side - Distribution Bars */}
      <div className="space-y-2">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-3">
            <span className="text-sm font-medium w-8 text-right">{rating}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-blue-100 w-12 text-right">
              {Math.round(percentage)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
