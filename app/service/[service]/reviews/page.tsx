import { getServiceBySlug } from "@/lib/action/service";
import { getReviewsByService } from "@/lib/action/review";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ReviewsList } from "@/components/review/ReviewsList";
import { ReviewFormDialog } from "@/components/review/ReviewFormDialog";
import { RatingSummary } from "@/components/review/RatingSummary";

interface ReviewsPageProps {
  params: Promise<{
    service: string;
  }>;
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { service } = await params;
  const result = await getServiceBySlug(service);

  if (!result.success || !result.data) {
    return {
      title: "Reviews Not Found",
    };
  }

  const serviceData = result.data;

  return {
    title: `${serviceData.name} Reviews | Customer Feedback & Ratings`,
    description: `Read ${serviceData.name} reviews from our satisfied customers. See ratings, feedback, and experiences shared by real users.`,
    openGraph: {
      title: `${serviceData.name} Reviews`,
      description: `Customer reviews and ratings for ${serviceData.name}`,
    },
    alternates: {
      canonical: `/service/${service}/reviews`,
    },
  };
}

export default async function ServiceReviewsPage({ params }: ReviewsPageProps) {
  const { service } = await params;
  const result = await getServiceBySlug(service);

  if (!result.success || !result.data) {
    notFound();
  }

  const serviceData = result.data;
  const reviews = await getReviewsByService(serviceData.id);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, review) => acc + Number(review.rating), 0) / totalReviews)
    : 0;

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    rating: star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
    percentage: totalReviews > 0
      ? (reviews.filter((r) => Number(r.rating) === star).length / totalReviews) * 100
      : 0,
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/service/${service}`}>
              <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Service
              </Button>
            </Link>
            <ReviewFormDialog serviceId={serviceData.id} serviceName={serviceData.name} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Reviews</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              {serviceData.name}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              See what our customers are saying about our service
            </p>

            {/* Rating Summary Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
              <RatingSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingCounts}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              All Reviews
            </h2>
            <span className="text-slate-500">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <ReviewsList reviews={reviews} serviceName={serviceData.name} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Have you used our service?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Share your experience and help others make informed decisions. Your feedback matters!
          </p>
          <ReviewFormDialog
            serviceId={serviceData.id}
            serviceName={serviceData.name}
            triggerButton={
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Write a Review
              </Button>
            }
          />
        </div>
      </section>
    </div>
  );
}
