import { getProductById } from "@/lib/action/product";
import { getReviewsByProduct } from "@/lib/action/review";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { ReviewsList } from "@/components/review/ReviewsList";
import { RatingSummary } from "@/components/review/RatingSummary";
import { ProductReviewFormDialog } from "@/components/second-hand/ProductReviewFormDialog";

interface ProductReviewsPageProps {
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductReviewsPageProps): Promise<Metadata> {
  const { productId } = await params;
  const result = await getProductById(productId);

  if (!result.success || !result.data) {
    return { title: "Reviews Not Found" };
  }

  const product = result.data;

  return {
    title: `${product.name} Reviews | Customer Feedback & Ratings`,
    description: `Read reviews for ${product.name}. See ratings, feedback, and experiences shared by real buyers.`,
    openGraph: {
      title: `${product.name} Reviews`,
      description: `Customer reviews and ratings for ${product.name}`,
    },
    alternates: {
      canonical: `/${product.category.slug}/${productId}/reviews`,
    },
  };
}

export default async function ProductReviewsPage({
  params,
}: ProductReviewsPageProps) {
  const { slug, productId } = await params;

  const [productResult, reviews] = await Promise.all([
    getProductById(productId),
    getReviewsByProduct(productId),
  ]);

  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  // Validate the slug matches the product's category
  if (product.category.slug !== slug) {
    notFound();
  }

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating), 0) / totalReviews
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    rating: star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => Number(r.rating) === star).length /
            totalReviews) *
          100
        : 0,
  }));

  // Map to the shape ReviewsList expects
  const reviewsForList = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    imageUrl: r.imageUrl ?? null,
    reviewer: r.reviewer,
    createdAt: r.createdAt,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${slug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Button>
            </Link>
            <ProductReviewFormDialog
              productId={productId}
              categoryId={null}
              productName={product.name}
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34h4v4h-4zM20 20h4v4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
              <MessageSquare className="w-4 h-4" />
              <span>Customer Reviews</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              {product.name}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              See what buyers are saying about this product
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
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </span>
          </div>

          <ReviewsList reviews={reviewsForList} serviceName={product.name} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Have you bought this product?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Share your experience and help other buyers make informed decisions.
            Your feedback matters!
          </p>
          <ProductReviewFormDialog
            productId={productId}
            categoryId={null}
            productName={product.name}
            triggerButton={
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Write a Review
              </Button>
            }
          />
        </div>
      </section>
    </div>
  );
}
