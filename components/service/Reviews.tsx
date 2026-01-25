import { Card, CardContent } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { Star, Quote } from "lucide-react";

export function ServiceReviews({ reviews }: {
    reviews: Array<{
        id: string;
        rating: string;
        comment: string;
        imageUrl: string | null;
        reviewer: string;
        createdAt: Date;
    }>
}) {
    return (
        <section className="py-16 md:py-24 md:mx-20 px-4">
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Customer Reviews
                    </h2>
                    <p className="text-lg text-slate-600">
                        See what our happy customers have to say about our service.
                    </p>
                </div>

                {/* Reviews Grid */}
                {(!reviews || reviews.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                        <Quote className="h-10 w-10 text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-900">No reviews yet</p>
                        <p className="text-slate-500">Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((review) => (
                            <Card
                                key={review.id}
                                className="group flex flex-col h-full border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 rounded-2xl overflow-hidden"
                            >
                                <CardContent className="p-6 flex flex-col h-full">
                                    {/* Header: Name & Date */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">
                                                {review.reviewer}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        {/* Star Rating */}
                                        <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-md">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < Number(review.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "fill-slate-200 text-slate-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="grow">
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            &quot;{review.comment}&quot;
                                        </p>
                                    </div>

                                    {/* Optional Image */}
                                    {review.imageUrl && (
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100">
                                                <CldImage
                                                    src={review.imageUrl}
                                                    alt={`Review by ${review.reviewer}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}