import { Mail, PhoneCall, MapPin, Clock, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactHighlights = [
  {
    icon: PhoneCall,
    label: "Call us",
    value: "+91 99999 99999",
    helper: "Mon–Sun • 8 AM – 10 PM",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@go-technicians.com",
    helper: "We reply within 4 working hours",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+91 98888 88888",
    helper: "Instant responses 7 days a week",
  },
];

const officeDetails = [
  { icon: MapPin, title: "Head Office", desc: "901, Tech Park, Andheri East, Mumbai 400093" },
  { icon: Clock, title: "Working Hours", desc: "Mon–Sun, 8:00 AM - 10:00 PM (IST)" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-purple-700">
            Contact Us
          </span>
          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            We’re here to help, anytime.
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Reach Go Technicians for bookings, partnership queries, support, or just to say hi.
            Our support crew replies faster than your AC cools a room.
          </p>
        </section>

        {/* Quick contact cards */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {contactHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="border-slate-200 shadow-sm">
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="inline-flex w-fit rounded-xl bg-purple-50 p-3">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-500">{item.helper}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Form + office info */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-0 bg-white shadow-xl shadow-purple-100/60">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">
                Tell us a little about your request
              </CardTitle>
              <p className="text-sm text-slate-500">
                Fill the form and we’ll respond within a few hours. Urgent? Call or WhatsApp us.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Full name" />
                <Input placeholder="Phone number" type="tel" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Email address" type="email" />
                <Input placeholder="City" />
              </div>
              <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200">
                <option>Select a service</option>
                <option>AC Repair</option>
                <option>Laptop Service</option>
                <option>Appliance Repair</option>
                <option>Home Cleaning</option>
                <option>Plumbing</option>
                <option>Other</option>
              </select>
              <Textarea rows={5} placeholder="How can we help you?" />
              <Button className="bg-linear-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600">
                Submit request
              </Button>
              <p className="text-xs text-slate-500">
                By submitting, you agree to receive updates via phone, WhatsApp, or email.
              </p>
            </CardContent>
          </Card>

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
                        <Icon className="h-5 w-5 text-purple-600" />
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

            <Card className="border-0 bg-linear-to-br from-purple-600 via-fuchsia-500 to-indigo-500 text-white shadow-lg">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm uppercase tracking-wider text-white/80">
                  Prefer instant support?
                </p>
                <h3 className="text-2xl font-semibold leading-tight">
                  Live chat with our concierge team in under 60 seconds.
                </h3>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-purple-700 hover:bg-slate-100"
                  asChild
                >
                  <a href="https://wa.me/919888888888" target="_blank" rel="noreferrer">
                    Start WhatsApp chat
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}