import { ReviewForm } from "@/components/review/Form";
import { getReviewById } from "@/lib/action/review";
import { notFound } from "next/navigation";

export default async function UpdateReviewPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const reviews = await getReviewById(id);

    if (!reviews) {
        notFound()
    }
    return (
        <div className="md:mx-20 py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Update Service</h1>
                <p className="text-muted-foreground">
                    Edit service details, sub-services, and FAQs
                </p>
            </div>
            <ReviewForm
                mode="update"
                review={{
                    ...reviews,
                    imageUrl: reviews.imageUrl === null ? undefined : reviews.imageUrl,
                }}
            />
        </div>
    );
}