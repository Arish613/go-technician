import { Mail, PhoneCall, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/ContactForm";

const contactHighlights = [
  {
    icon: PhoneCall,
    label: "Call us",
    value: "+91 79776 61546",
    helper: "Mon–Sun",
  },
  {
    icon: Mail,
    label: "Email",
    value: "gotechnicians.com@gmail.com",
    helper: "We reply within 4 working hours",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 79776 61546",
    helper: "Instant responses 7 days a week",
  },
];

const officeDetails = [
  { icon: MapPin, title: "Head Office", desc: "Mumbai/Navi Mumbai/Thane" },
  { icon: Clock, title: "Working Hours", desc: "Mon–Sun" },
];

export const metadata = {
  title: "Contact Us | Go Technicians",
  description: "Get in touch with Go Technicians for bookings, support, or partnership queries. We're here to help you anytime.",
  alternates: {
    canonical: "https://www.gotechnicians.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
            Contact Us
          </span>
          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            We&apos;re here to help, anytime.
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Reach Go Technicians for bookings, partnership queries, support, or just to say hi.
            Our support crew replies faster than your AC cools a room.
          </p>
        </section>


        {/* Form + office info */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Visit us</CardTitle>
                <p className="text-sm text-slate-500">
                  Drop by for partnerships, interviews, or a cup of chai.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {officeDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.title} className="flex gap-3">
                      <div className="rounded-full bg-slate-100 p-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{detail.title}</p>
                        <p className="text-sm text-slate-600">{detail.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-0 bg-linear-to-br from-blue-600 via-sky-500 to-indigo-500 text-white shadow-lg">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm uppercase tracking-wider text-white/80">
                  Prefer instant support?
                </p>
                <h3 className="text-2xl font-semibold leading-tight">
                  Live chat with our concierge team in under 60 seconds.
                </h3>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-blue-700 hover:bg-slate-100"
                  asChild
                >
                  <a href="https://wa.me/917977661546" target="_blank" rel="noreferrer">
                    Start WhatsApp chat
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick contact cards */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {contactHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-slate-200 shadow-sm p-0">
                <CardContent className="flex flex-col gap-3 p-4 md:p-6">
                  <div className="inline-flex w-fit rounded-xl bg-blue-50 p-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-500">{item.helper}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

      </div>
    </main>
  );
}