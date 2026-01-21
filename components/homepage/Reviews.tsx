import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "/reviews/avatar-1.jpg",
    rating: 5,
    service: "AC Repair",
    review:
      "Excellent service! The technician arrived on time, diagnosed the issue quickly, and fixed my AC within an hour. Very professional and transparent pricing.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    name: "Rahul Verma",
    location: "Delhi",
    rating: 5,
    service: "Laptop Service",
    review:
      "My laptop had a severe overheating issue. The technician not only fixed it but also cleaned the entire system. Great value for money!",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Bangalore",
    rating: 4,
    service: "Home Cleaning",
    review:
      "The deep cleaning service was thorough and the team was very professional. My home looks spotless now. Will definitely book again!",
    date: "3 days ago",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Hyderabad",
    rating: 5,
    service: "Plumbing",
    review:
      "Quick response and efficient work. The plumber fixed a major leak that other services couldn't diagnose. Highly recommended!",
    date: "5 days ago",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    location: "Chennai",
    rating: 5,
    service: "Appliances Repair",
    review:
      "My washing machine was making strange noises. The technician fixed it in no time. Affordable and reliable service!",
    date: "1 week ago",
  },
  {
    id: 6,
    name: "Amit Kumar",
    location: "Pune",
    rating: 4,
    service: "AC Repair",
    review:
      "Good service overall. The technician was knowledgeable and explained everything clearly. Minor delay but quality work.",
    date: "4 days ago",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="border-t border-slate-200 bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Read Customer Reviews
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-slate-600">
            See what our customers have to say about their experience with Go
            Technicians. Real reviews from real people.
          </p>

          {/* Overall Rating */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-50 px-6 py-3">
            <div className="flex items-center gap-1">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-slate-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <span className="text-sm text-slate-600">
              Based on {reviews.length * 1000}+ reviews
            </span>
          </div>
        </div>

        <div className="mb-5">
          <Carousel
            className="w-full max-w-5xl mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="-ml-1">
              {reviews.map((review, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="border-none bg-white shadow-none max-w-xl rounded-xl ring-0">
                      <CardContent className="p-6 border-none shadow-none flex flex-col h-full">
                        <Quote className="mb-4 h-8 w-8 text-blue-200" />
                        <p className="mb-4 text-sm leading-relaxed text-slate-600">
                          &ldquo;{review.review}&rdquo;
                        </p>
                        <div className="mb-4">
                          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                            {review.service}
                          </span>
                        </div>
                        <div className="mb-4">
                          <StarRating rating={review.rating} />
                        </div>
                        <div className="flex items-center gap-3 mt-auto">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {review.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {review.location} • {review.date}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:left-4 w-10 h-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:right-4 w-10 h-10" />  
          </Carousel>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600">
            Join thousands of satisfied customers.{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Book your first service today →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
