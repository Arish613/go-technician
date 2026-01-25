import { ComplaintForm } from "@/components/RaiseComplaint";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HeadphonesIcon, MessageSquare, Shield } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Raise a Complaint | Go Technicians",
  description:
    "Have an issue with our service? Raise a complaint and our team will resolve it within 24-48 hours.",
};

const supportFeatures = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "We respond to all complaints within 24-48 hours",
  },
  {
    icon: Shield,
    title: "Resolution Guaranteed",
    description: "We ensure every complaint is resolved satisfactorily",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Our support team is available 7 days a week",
  },
  {
    icon: MessageSquare,
    title: "Keep You Updated",
    description: "Regular updates on your complaint status via SMS/Email",
  },
];

export default function RaiseAComplaintPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Raise a Complaint
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            We&apos;re sorry to hear you had an issue. Please share your
            concerns and we&apos;ll make it right.
          </p>
        </div>
      </section>

      {/* Support Features */}
      <section className="container mx-auto -mt-8 px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {supportFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-slate-200 bg-white shadow-md"
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Main Content */}
      <section className="md:mx-20 px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <ComplaintForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-slate-200 bg-white shadow-md">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">
                  Need Immediate Help?
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Call Us
                    </p>
                    <a
                      href="tel:+917977661546"
                      className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                    >
                      +91 79776 61546
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Email Us
                    </p>
                    <a
                      href="mailto:gotechnicians.com@gmail.com"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      gotechnicians.com@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Working Hours
                    </p>
                    <p className="text-slate-600">
                      Mon - Sun
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-blue-900">
                  Tips for Faster Resolution
                </h3>
                <ul className="space-y-3 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    Include your booking ID if you have one
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    Provide specific dates and times
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    Mention the technician&apos;s name if known
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    Attach photos or screenshots if relevant
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    Be as detailed as possible
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="border-slate-200 bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-slate-600">
                  Looking for answers to common questions?
                </p>
                <Link
                  href="/#faq"
                  className="mt-2 inline-block font-semibold text-blue-600 hover:text-blue-700"
                >
                  Visit our FAQ section →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
