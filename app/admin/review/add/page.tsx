"use client"

import { ReviewForm } from "@/components/review/Form";

export default function AddReviewPage() {
    return (
        <div className="md:mx-20 py-8 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Add New Service</h1>
                <p className="text-muted-foreground">
                    Create a new service with sub-services and FAQs
                </p>
            </div>
            <ReviewForm mode="create" />
        </div>
    );
}