"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createReview } from "@/lib/action/review";
import { getServices } from "@/lib/action/service";
import { Star, Send, CheckCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const reviewSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review must not exceed 1000 characters"),
  reviewer: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface Service {
  id: string;
  name: string;
}

export default function ReviewPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      serviceId: "",
      rating: 0,
      comment: "",
      reviewer: "",
      imageUrl: "",
    },
  });

  const selectedRating = form.watch("rating");

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        if (res.success && Array.isArray(res.data)) {
          setServices(res.data.map((s: Service) => ({ id: s.id, name: s.name })));
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      await createReview({
        ...data,
        rating: data.rating.toString(),
        subServiceId: null, // Only service reviews
      });

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Thank You!
              </h2>
              <p className="text-slate-600 mb-6">
                Your review has been submitted successfully. We appreciate your feedback!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                  Write Another Review
                </Button>
                <Link href="/">
                  <Button>Go Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">

      {/* Form Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Write a Review
              </CardTitle>
              <CardDescription className="text-center">
                Tell us about your experience with our service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Service Select */}
                <div className="space-y-2">
                  <Label htmlFor="serviceId" className="text-sm font-medium">
                    Select Service <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.watch("serviceId")}
                    onValueChange={(value) => form.setValue("serviceId", value)}
                    disabled={isLoadingServices}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingServices ? "Loading services..." : "Choose a service"} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.serviceId && (
                    <p className="text-sm text-red-500">{form.formState.errors.serviceId.message}</p>
                  )}
                </div>

                {/* Star Rating */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Your Rating <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => form.setValue("rating", star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${star <= (hoverRating || selectedRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-slate-200 text-slate-200"
                            }`}
                        />
                      </button>
                    ))}
                    <span className="ml-3 text-sm text-slate-600 font-medium">
                      {selectedRating > 0 && (
                        <>
                          {selectedRating === 5 && "Excellent"}
                          {selectedRating === 4 && "Very Good"}
                          {selectedRating === 3 && "Good"}
                          {selectedRating === 2 && "Fair"}
                          {selectedRating === 1 && "Poor"}
                        </>
                      )}
                    </span>
                  </div>
                  {form.formState.errors.rating && (
                    <p className="text-sm text-red-500">{form.formState.errors.rating.message}</p>
                  )}
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Your Review <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your experience with this service... What did you like? What could be improved?"
                    className="min-h-37.5 resize-none"
                    {...form.register("comment")}
                  />
                  {form.formState.errors.comment && (
                    <p className="text-sm text-red-500">{form.formState.errors.comment.message}</p>
                  )}
                  <p className="text-xs text-slate-400 text-right">
                    {form.watch("comment")?.length || 0}/1000
                  </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="reviewer" className="text-sm font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reviewer"
                    placeholder="Enter your full name"
                    {...form.register("reviewer")}
                  />
                  {form.formState.errors.reviewer && (
                    <p className="text-sm text-red-500">{form.formState.errors.reviewer.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Review
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
