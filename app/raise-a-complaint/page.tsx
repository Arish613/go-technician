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
      <section className="bg-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Raise a Complaint
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">
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
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Icon className="h-5 w-5 text-purple-600" />
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
                      href="tel:+911234567890"
                      className="text-lg font-semibold text-purple-600 hover:text-purple-700"
                    >
                      +91 12345 67890
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Email Us
                    </p>
                    <a
                      href="mailto:support@gotechnicians.com"
                      className="text-purple-600 hover:text-purple-700"
                    >
                      support@gotechnicians.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Working Hours
                    </p>
                    <p className="text-slate-600">
                      Mon - Sat: 9:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-purple-900">
                  Tips for Faster Resolution
                </h3>
                <ul className="space-y-3 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                    Include your booking ID if you have one
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                    Provide specific dates and times
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                    Mention the technician&apos;s name if known
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
                    Attach photos or screenshots if relevant
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-600" />
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
                  className="mt-2 inline-block font-semibold text-purple-600 hover:text-purple-700"
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
