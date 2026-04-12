"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { deleteReview } from "@/lib/action/review";

interface Review {
  id: string;
  rating: number;
  reviewer: string;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

interface SubService {
  id: string;
  name: string;
  reviews: Review[];
}

interface Service {
  id: string;
  name: string;
  slug: string;
  reviews: Review[];
  subServices: SubService[];
}

interface Product {
  id: string;
  name: string;
  reviews: Review[];
  category: { name: string };
}

export default function GetAllReviews() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const [serviceRes, productRes] = await Promise.all([
        fetch("/api/service/review"),
        fetch("/api/product/review"),
      ]);
      if (!serviceRes.ok) throw new Error("Failed to fetch service reviews");
      const serviceData = await serviceRes.json();
      setServices(serviceData);
      if (productRes.ok) {
        const productData = await productRes.json();
        setProducts(productData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingId(reviewId);
    try {
      const result = await deleteReview(reviewId);
      if (result) {
        // Refresh the reviews list
        await fetchReviews();
        alert("Review deleted successfully!");
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="md:mx-20 py-8 px-4 flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:mx-20 py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderReviewCard = (review: Review) => (
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
              <span className="font-semibold">{review.reviewer}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
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
              onClick={() => handleDelete(review.id)}
              disabled={deletingId === review.id}
            >
              {deletingId === review.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="md:mx-20 py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer reviews
          </p>
        </div>
        <Link href="/admin/review/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Review
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">
            Services ({services.reduce((acc, s) => acc + s.reviews.length + s.subServices.reduce((a, ss) => a + ss.reviews.length, 0), 0)})
          </TabsTrigger>
          <TabsTrigger value="products">
            Products ({products.reduce((acc, p) => acc + p.reviews.length, 0)})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No service reviews found.</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {services.map((service) => (
                <AccordionItem key={service.id} value={service.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{service.name}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({service.reviews.length + service.subServices.reduce((acc, ss) => acc + ss.reviews.length, 0)} reviews)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-2">
                      {service.reviews.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm text-muted-foreground">
                            Service Reviews
                          </h3>
                          {service.reviews.map(renderReviewCard)}
                        </div>
                      )}

                      {service.subServices.map((subService) => (
                        <div key={subService.id} className="space-y-4">
                          <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            {subService.name}
                            <span className="text-xs font-normal">
                              ({subService.reviews.length} review
                              {subService.reviews.length !== 1 ? "s" : ""})
                            </span>
                          </h3>
                          {subService.reviews.map(renderReviewCard)}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        <TabsContent value="products">
          {products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No product reviews found.</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {products.map((product) => (
                <AccordionItem key={product.id} value={product.id} className="border rounded-lg px-4">
                  <AccordionTrigger>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {product.name}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({product.category?.name}) - {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
                      </span>
                    </CardTitle>
                  </AccordionTrigger>
                  <AccordionContent>
                    {product.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map(renderReviewCard)}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No reviews yet</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}