import { Card, CardContent } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import { Star, StarHalf } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


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
        <section className="py-14 md:py-24 md:mx-20 px-4">
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-5 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Customer Reviews
                    </h2>
                    <p className="md:text-lg text-slate-600">
                        See what our happy customers have to say about our service.
                    </p>
                </div>

                {/* Reviews Grid */}
                {(
                    <div className="relative px-2 md:px-12">
                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {reviews.map((review) => (
                                    <CarouselItem
                                        key={review.id}
                                        className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                                    >
                                        <Card
                                            className="group flex flex-col h-full bg-white shadow-sm hover:shadow-lg border-none transition-all duration-300 rounded-2xl overflow-hidden ring-0"
                                        >
                                            <CardContent className="p-6 flex flex-col h-full border-none">
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
                                                        {(() => {
                                                            const rating = Number(review.rating);
                                                            return Array.from({ length: 5 }).map((_, i) => {
                                                                if (rating >= i + 1) {
                                                                    return (
                                                                        <Star
                                                                            key={i}
                                                                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                                                        />
                                                                    );
                                                                } else if (rating > i && rating < i + 1) {
                                                                    return (
                                                                        <StarHalf
                                                                            key={i}
                                                                            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                                                                        />
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <Star
                                                                            key={i}
                                                                            className="h-3.5 w-3.5 fill-slate-200 text-slate-200"
                                                                        />
                                                                    );
                                                                }
                                                            });
                                                        })()}
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
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
                            <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
                        </Carousel>
                    </div>
                )}
            </div>
        </section>
    );
}