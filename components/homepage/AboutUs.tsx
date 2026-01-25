import {
  CheckCircle2,
  Shield,
  Clock,
  Award,
  Users,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Verified Experts",
    description:
      "All technicians undergo thorough background checks and skill verification.",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Get your service done on the same day in most metro cities.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description:
      "30-day warranty on all services with 100% satisfaction guarantee.",
  },
  {
    icon: Users,
    title: "25,000+ Happy Customers",
    description:
      "Join thousands of satisfied customers who trust our services.",
  },
  {
    icon: Wrench,
    title: "Transparent Pricing",
    description: "No hidden charges. What you see is what you pay.",
  },
  {
    icon: CheckCircle2,
    title: "Hassle-free Booking",
    description:
      "Book in seconds through our app or website. Track in real-time.",
  },
  {
    icon: Clock,
    title: "Service Charges",
    description: "Please note: if a technician visits and no work is performed, a visit fee of 299 will still apply.",
  }
];

const stats = [
  { value: "25,000+", label: "Happy Customers" },
  { value: "10+", label: "Cities Covered" },
  { value: "10,000+", label: "Services Completed" },
  { value: "4.9/5", label: "Average Rating" },
];

export function AboutUs() {
  return (
    <section id="about" className="border-t border-slate-200 bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            About Us
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Why Thousands Trust Go Technicians
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-slate-600">
            We&apos;re on a mission to make home and office maintenance
            hassle-free. Book verified experts for any service, get transparent
            pricing, and enjoy warranty-backed quality work.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-5">
          <Carousel
            className="w-full  mx-auto"
            opts={{
              loop: true,
            }}
          >
            <CarouselContent className="-ml-1">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <CarouselItem
                    key={idx}
                    className="pl-1  md:basis-1/2 lg:basis-1/5 max-sm:shadow-xl max-sm:border"
                  >
                    <div className="p-1">
                      <Card className="border-none bg-white shadow-none rounded-xl ring-0 py-0">
                        <CardContent className="flex flex-col items-center justify-center aspect-square p-6">
                          <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-slate-900 text-center">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-slate-600 text-center">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:left-4 w-10 h-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:right-4 w-10 h-10" />
          </Carousel>
        </div>

        {/* Story Section */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Our Story</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Go Technicians was founded with a simple idea: home and office
                services should be as easy as ordering food online. We started
                in 2020 with a small team of 10 technicians serving one city.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Today, we&apos;ve grown to 30+ cities across India, serving
                25,000+ happy customers with a network of verified
                professionals. Every service is backed by our quality guarantee
                and transparent pricing.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Verified Professionals
                  </h4>
                  <p className="text-sm text-slate-600">
                    Background-checked experts with proven skills
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Warranty-Backed Service
                  </h4>
                  <p className="text-sm text-slate-600">
                    30-day warranty on all repairs and installations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Real-Time Tracking
                  </h4>
                  <p className="text-sm text-slate-600">
                    Know exactly when your technician will arrive
                  </p>
                </div>
              </div>
            </div>

            <Link href="/contact" prefetch={true}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book a Service Now
              </Button>
            </Link>
          </div>

          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="relative aspect-4/3">
                  <Image
                    src="/about-us.jpg"
                    alt="Go Technicians Team"
                    width={900}
                    height={450}
                  // className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Floating Card */}
            <Card className="absolute -bottom-6 -left-6 border-slate-200 bg-white shadow-lg lg:-left-12">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100+</div>
                    <div className="text-sm text-slate-600">
                      Expert Technicians
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Our Mission
              </h3>
              <p className="text-base leading-relaxed text-slate-600">
                To make quality home and office services accessible to everyone
                through technology, verified professionals, and transparent
                pricing. We believe everyone deserves reliable service without
                the hassle.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Our Vision
              </h3>
              <p className="text-base leading-relaxed text-slate-600">
                To become India&apos;s most trusted platform for home services,
                empowering thousands of skilled professionals while making life
                easier for millions of customers across the country.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
