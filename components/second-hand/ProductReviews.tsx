import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductReviewFormDialog } from "./ProductReviewFormDialog";

interface ProductReview {
  id: string;
  rating: string;
  comment: string;
  imageUrl: string | null;
  reviewer: string;
  createdAt: Date;
}

interface ProductReviewsProps {
  reviews: ProductReview[];
  productId: string | null;
  categoryId: string | null;
  productName: string;
  categorySlug: string;
}

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-md">
      {Array.from({ length: 5 }).map((_, i) => {
        if (rating >= i + 1) {
          return (
            <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          );
        } else if (rating > i && rating < i + 1) {
          return (
            <StarHalf key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          );
        } else {
          return (
            <Star key={i} className="h-3.5 w-3.5 fill-slate-200 text-slate-200" />
          );
        }
      })}
    </div>
  );
}

export function ProductReviews({
  reviews,
  productId,
  categoryId,
  productName,
  categorySlug,
}: ProductReviewsProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
      : 0;

  return (
    <section className="py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
              Customer Reviews
            </h2>
            {reviews.length > 0 ? (
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">
                  {averageRating.toFixed(1)}
                </span>{" "}
                out of 5 &mdash; {reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"}
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                No reviews yet — be the first!
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {reviews.length > 0 && productId && (
              <Link href={`/${categorySlug}/${productId}/reviews`}>
                <Button variant="outline" className="gap-2">
                  View all reviews
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <ProductReviewFormDialog
              productId={productId}
              categoryId={categoryId}
              productName={productName}
            />
          </div>
        </div>

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <div className="relative px-2 md:px-12">
            <Carousel
              opts={{ align: "start", loop: reviews.length > 3 }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {reviews.map((review) => (
                  <CarouselItem
                    key={review.id}
                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="group flex flex-col h-full bg-white shadow-sm hover:shadow-lg border-none transition-all duration-300 rounded-2xl overflow-hidden ring-0">
                      <CardContent className="p-6 flex flex-col h-full border-none">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">
                              {review.reviewer}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <StarRatingDisplay rating={Number(review.rating)} />
                        </div>

                        {/* Comment */}
                        <div className="grow">
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                            &quot;{review.comment}&quot;
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50" />
              <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50" />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground mb-4">
              Share your experience to help other buyers make informed decisions.
            </p>
            <ProductReviewFormDialog
              productId={productId}
              categoryId={categoryId}
              productName={productName}
              triggerButton={
                <Button className="bg-primary hover:bg-primary/90">
                  Write the First Review
                </Button>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
