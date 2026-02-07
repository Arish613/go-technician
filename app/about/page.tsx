import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Clock,
  Award,
  Target,
  Eye,
  Heart,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Go Technicians",
  description:
    "Learn about Go Technicians - Your trusted partner for home and office services. Verified experts, transparent pricing, and quality guaranteed.",
  alternates: {
    canonical: "https://www.gotechnicians.coms/about",
  }
};

const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "30+", label: "Cities Covered" },
  { value: "10,000+", label: "Services Completed" },
  { value: "4.8/5", label: "Average Rating" },
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

const milestones = [
  {
    year: "2020",
    title: "Founded",
    description:
      "Go Technicians was born with a vision to transform home services in India.",
  },
  {
    year: "2021",
    title: "Expansion",
    description:
      "Expanded to 10 major cities and onboarded 1,000+ verified technicians.",
  },
  {
    year: "2022",
    title: "Growth",
    description:
      "Crossed 25,000 happy customers and launched new service categories.",
  },
  {
    year: "2023",
    title: "Recognition",
    description:
      "Awarded 'Best Home Services Platform' and expanded to 30+ cities.",
  },
  {
    year: "2024",
    title: "Innovation",
    description:
      "Launched AI-powered service recommendations and same-day service guarantee.",
  },
];

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "/team/ceo.jpg",
    description: "15+ years of experience in technology and service industry.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Operations",
    image: "/team/operations.jpg",
    description: "Expert in scaling service operations across multiple cities.",
  },
  {
    name: "Amit Patel",
    role: "CTO",
    image: "/team/cto.jpg",
    description:
      "Building technology that connects customers with the right experts.",
  },
  {
    name: "Sneha Reddy",
    role: "Customer Success",
    image: "/team/customer-success.jpg",
    description: "Ensuring every customer has a delightful experience.",
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
              Making Home Services{" "}
              <span className="text-blue-200">Simple & Reliable</span>
            </h1>
            <p className="mt-6 text-lg text-blue-100">
              Go Technicians is on a mission to transform how India experiences
              home and office services. We connect you with verified, skilled
              professionals for all your service needs.
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

      {/* Our Story Section */}
      <section className=" px-4 py-16 md:mx-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Story
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              From a Simple Idea to Transforming Home Services
            </h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                Go Technicians started with a simple observation: finding
                reliable home service professionals was a frustrating
                experience. From unverified technicians to unclear pricing,
                customers deserved better.
              </p>
              <p>
                Founded in 2020, we set out to build a platform that brings
                transparency, reliability, and quality to home services. We
                carefully vet every technician, ensure fair pricing, and back
                every service with our satisfaction guarantee.
              </p>
              <p>
                Today, we serve over 50,000 happy customers across 30+ cities,
                and we&apos;re just getting started. Our vision is to be the
                most trusted name in home services across India.
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
                  alt="Go Technicians Team"
                  width={900}
                  height={450}
                // className="object-cover"
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

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-16">
        <div className="md:mx-20 px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-white shadow-md">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  Our Mission
                </h3>
                <p className="text-slate-600">
                  To make quality home and office services accessible,
                  affordable, and hassle-free for every household in India.
                  We&apos;re committed to empowering skilled professionals while
                  delivering exceptional experiences to our customers.
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-white shadow-md">
              <CardContent className="p-8">
                <div className="mb-4 inline-block rounded-lg bg-blue-100 p-3">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  Our Vision
                </h3>
                <p className="text-slate-600">
                  To become India&apos;s most trusted platform for home
                  services, known for quality, reliability, and customer
                  satisfaction. We envision a future where every home has access
                  to professional services at the tap of a button.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="md:mx-20 px-4 py-16">
        <div className="mb-6 md:mb-12 text-center">
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
      </section>

      {/* Journey/Timeline */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Journey
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Milestones Along the Way
            </h2>
          </div>
          <div className="relative mx-auto max-w-4xl">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-blue-200 md:block" />

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex flex-col gap-4 md:flex-row md:gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                >
                  <div className="flex-1 md:text-right">
                    {index % 2 === 0 && (
                      <Card className="border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-6">
                          <div className="mb-2 text-sm font-semibold text-blue-600">
                            {milestone.year}
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 top-6 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-blue-600 bg-white md:block" />

                  <div className="flex-1">
                    {index % 2 !== 0 && (
                      <Card className="border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-6">
                          <div className="mb-2 text-sm font-semibold text-blue-600">
                            {milestone.year}
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    {index % 2 === 0 && (
                      <Card className="border-slate-200 bg-white shadow-sm md:invisible">
                        <CardContent className="p-6">
                          <div className="mb-2 text-sm font-semibold text-blue-600">
                            {milestone.year}
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {milestone.description}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="md:mx-20 px-4 py-16">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Meet The Team
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            The People Behind Go Technicians
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Our leadership team brings decades of combined experience in
            technology, operations, and customer service.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card
              key={member.name}
              className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-slate-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-blue-600">
                  {member.role}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Contact CTA */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="mt-4 text-blue-100">
              Have questions or want to learn more about our services? We&apos;d
              love to hear from you.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="mb-3 rounded-full bg-white/10 p-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Our Office</h3>
                <p className="mt-1 text-sm text-blue-100">
                  Mumbai/ Navi Mumbai/ Thane
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
              <Link href="/raise-a-complaint">
                <Button
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Raise a Complaint
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
