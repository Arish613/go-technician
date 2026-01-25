import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAllReviewsGroupedByService } from "@/lib/action/review";


export default async function GetAllReviews() {
    const services = await getAllReviewsGroupedByService();

    return (
        <div className="md:mx-20 py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">All Reviews</h1>
                    <p className="text-muted-foreground">
                        Manage customer reviews grouped by services
                    </p>
                </div>
                <Link href="/admin/review/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Review
                    </Button>
                </Link>
            </div>

            {services.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No reviews found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {services.map((service) => (
                        <Card key={service.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {service.name}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        ({service.reviews.length} review
                                        {service.reviews.length !== 1 ? "s" : ""})
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {service.reviews.map((review) => (
                                        <Card key={review.id} className="border-l-4 border-l-primary">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="flex items-center">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < Number(review.rating)
                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="font-semibold">
                                                                {review.reviewer}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {review.comment}
                                                        </p>
                                                        {review.imageUrl && (
                                                            <div className="mt-3">
                                                                <Image
                                                                    src={review.imageUrl}
                                                                    alt="Review"
                                                                    width={200}
                                                                    height={150}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link href={`/admin/review/update/${review.id}`}>
                                                            <Button size="icon" variant="outline">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}