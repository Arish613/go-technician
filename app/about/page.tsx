import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Clock,
  Award,
  Heart,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Go Technicians",
  description:
    "Gotechnicians is a Mumbai-based home service company providing reliable AC repair, appliance servicing, plumbing, and home cleaning services across Mumbai, Thane, and Navi Mumbai.",
  alternates: {
    canonical: "https://www.gotechnicians.com/about",
  }
};

const stats = [
  { value: "1000+", label: "Customers Assisted" },
  { value: "3", label: "Cities Covered" },
  { value: "100%", label: "Verified Technicians" },
  { value: "4.9/5", label: "Customer Satisfaction" },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every technician undergoes rigorous background verification and skill assessments before joining our platform.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description:
      "We maintain the highest standards of service quality with regular training and performance monitoring.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Your satisfaction is our priority. We go above and beyond to ensure every service exceeds expectations.",
  },
  {
    icon: Clock,
    title: "Reliability",
    description:
      "Punctual service delivery with real-time tracking and transparent communication throughout.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-200">
              About Us
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Mumbai&apos;s Trusted Home Service Partner
            </h1>
            <p className="mt-6 text-lg text-blue-100">
              Gotechnicians is a Mumbai-based home service company dedicated to providing reliable, on-time, and professional repair and maintenance solutions for households and offices.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto -mt-10 px-4">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-slate-200 bg-white shadow-lg"
            >
              <CardContent className="md:p-6 text-center">
                <div className="text-xl md:text-3xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About Content Section */}
      <section className=" px-4 py-16 md:mx-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Who We Are
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Professional Home Services You Can Trust
            </h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                Gotechnicians is a Mumbai-based home service company dedicated to providing reliable, on-time, and professional repair and maintenance solutions for households and offices. We specialize in AC repair and servicing, laptop repair, washing machine repair, refrigerator repair, plumbing services, and home cleaning, serving customers across Mumbai, Thane, and Navi Mumbai.
              </p>
              <p>
                Founded by Arish Sayyed, Gotechnicians was built with a clear goal — to make home services simple, transparent, and trustworthy. Over time, we have successfully assisted 1000+ customers by connecting them with trained, experienced, and background-verified technicians who understand the importance of quality work and customer satisfaction.
              </p>
              <p>
                At Gotechnicians, we follow a strict verification process before onboarding any technician. Every professional is skill-tested, ID-verified, and experienced in their respective service area. This ensures that our customers receive safe, dependable, and hassle-free service every time they book with us.
              </p>
              <p>
                We believe in transparent pricing with no hidden charges. Customers are informed about service costs upfront, and our technicians focus on delivering effective solutions rather than unnecessary upselling. Whether it&apos;s an urgent AC breakdown, appliance repair, or routine home maintenance, our team responds quickly and works efficiently to minimize inconvenience.
              </p>
              <p>
                With a growing presence across Mumbai, Thane, and Navi Mumbai, Gotechnicians continues to expand its service network while maintaining high service standards. Our commitment to quality workmanship, honest pricing, and timely support makes us a preferred choice for home services in the region.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/service">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative aspect-4/3">
                <Image
                  src="/about-us.png"
                  alt="Gotechnicians Team"
                  width={900}
                  height={450}
                />
              </div>
            </Card>
            <Card className="absolute -bottom-6 -left-6 border-slate-200 bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      100%
                    </div>
                    <div className="text-sm text-slate-600">
                      Verified Experts
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services We Offer */}
      <section className="bg-slate-50 py-16">
        <div className="md:mx-20 px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Services
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Services We Specialize In
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "AC Repair & Servicing", desc: "Complete AC solutions including installation, repair, and annual maintenance" },
              { title: "Laptop Repair", desc: "Hardware and software troubleshooting for all major laptop brands" },
              { title: "Washing Machine Repair", desc: "Expert repair services for all types of washing machines" },
              { title: "Refrigerator Repair", desc: "Cooling issues, compressor problems, and general maintenance" },
              { title: "Plumbing Services", desc: "Leak repairs, pipe fitting, bathroom fittings, and drainage solutions" },
              { title: "Home Cleaning", desc: "Deep cleaning, regular maintenance, and specialized cleaning services" },
            ].map((service) => (
              <Card key={service.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="md:mx-20 px-4 py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Coverage Areas
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Serving Across Mumbai Region
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { city: "Mumbai", desc: "All major areas and localities" },
            { city: "Thane", desc: "Complete Thane district coverage" },
            { city: "Navi Mumbai", desc: "All nodes and surrounding areas" },
          ].map((area) => (
            <Card key={area.city} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 inline-block rounded-full bg-blue-100 p-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {area.city}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{area.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-center text-slate-600">And nearby surrounding locations</p>
      </section>

      {/* Our Values */}
      <section className="bg-slate-50 py-16">
        <div className="md:mx-20 px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What We Stand For
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Our Values</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="p-3 md:p-6 text-center">
                    <div className="mx-auto mb-4 inline-block rounded-full bg-blue-100 p-2 md:p-4">
                      <Icon className="md:h-8 md:w-8 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="md:mx-20 px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why Gotechnicians
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              What Makes Us Different
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "Strict verification process for all technicians",
                "Skill-tested and ID-verified professionals",
                "Transparent pricing with no hidden charges",
                "Upfront cost information before service",
                "Quick response and efficient service delivery",
                "Focus on effective solutions, not upselling",
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-white shadow-lg">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  Founded by Arish Sayyed
                </h3>
                <p className="text-slate-600">
                  With a vision to transform home services in Mumbai, Arish Sayyed founded Gotechnicians to make home services simple, transparent, and trustworthy for every household.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="mt-4 text-blue-100">
              Have questions or want to book a service? We&apos;d love to hear from you.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-3 rounded-full bg-white/10 p-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Our Office</h3>
                <p className="mt-1 text-sm text-blue-100">
                  Mumbai / Thane / Navi Mumbai
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3 rounded-full bg-white/10 p-3">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Phone</h3>
                <a
                  href="tel:+917977661546"
                  className="mt-1 text-sm text-blue-100 hover:text-white"
                >
                  +91 79776 61546
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3 rounded-full bg-white/10 p-3">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href="mailto:gotechnicians.com@gmail.com"
                  className="mt-1 text-sm text-blue-100 hover:text-white"
                >
                  gotechnicians.com@gmail.com
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/service">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Book a Service
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-black"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
