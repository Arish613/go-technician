import { Mail, PhoneCall, MapPin, Clock, MessageCircle, Shield, ShieldCheck, Users, MapPinned, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us | Go Technicians",
  description: "Get in touch with Go Technicians for bookings, support, or partnership queries. We provide reliable home services across Mumbai, Thane, and Navi Mumbai.",
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
            We&apos;re here to help you with quick, reliable, and professional home services.
          </h1>
          <p className="mt-4 text-base text-slate-600">
            We provide services across Mumbai and nearby areas. If you need assistance with AC repair, appliance servicing, plumbing, or home cleaning, feel free to reach out to us.
          </p>
        </section>

        {/* Form + contact info */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />

          <div className="space-y-6">
            {/* Get in Touch */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <PhoneCall className="h-5 w-5 text-blue-600" />
                  Get in Touch
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Our support team is available to answer your queries, schedule service requests, and provide updates on ongoing jobs.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <PhoneCall className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Phone</p>
                    <a href="tel:+917977661546" className="text-sm text-slate-600 hover:text-blue-600">
                      +91 79776 61546
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">WhatsApp</p>
                    <a href="https://wa.me/917977661546" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-blue-600">
                      +91 79776 61546
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-full bg-slate-100 p-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email</p>
                    <a href="mailto:gotechnicians.com@gmail.com" className="text-sm text-slate-600 hover:text-blue-600">
                      gotechnicians.com@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Monday to Sunday:</span> 8:00 AM – 10:00 PM
                </p>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="border-0 bg-linear-to-br from-blue-600 via-sky-500 to-indigo-500 text-white shadow-lg">
              <CardContent className="space-y-4 p-6">
                <p className="text-sm uppercase tracking-wider text-white/80">
                  Prefer instant support?
                </p>
                <h3 className="text-2xl font-semibold leading-tight">
                  Chat with us on WhatsApp for quick responses.
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

        {/* Office Address */}
        <section className="mt-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Office Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="rounded-full bg-slate-100 p-2 h-fit">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Gotechnicians</p>
                  <p className="text-sm text-slate-600">
                    Shop No. 4th Floor &ldquo;C&rdquo; Wing, Fakir Shah Apartment,<br />
                    Thane – 400612, Maharashtra, India
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Service Areas */}
        <section className="mt-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-blue-600" />
                Service Areas
              </CardTitle>
              <p className="text-sm text-slate-500">
                We currently provide home services in:
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">Mumbai</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">Thane</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-900">Navi Mumbai</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">And nearby surrounding locations</p>
            </CardContent>
          </Card>
        </section>

        {/* How Our Service Works */}
        <section className="mt-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                How Our Service Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</div>
                  <p className="text-sm text-slate-700">Contact us via call, WhatsApp, or enquiry form</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</div>
                  <p className="text-sm text-slate-700">Share your service requirement and location</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</div>
                  <p className="text-sm text-slate-700">Get a technician assigned based on availability</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">4</div>
                  <p className="text-sm text-slate-700">Service delivered at your doorstep with transparent pricing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Customer Safety & Transparency */}
        <section className="mt-12">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Customer Safety & Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-slate-700">All technicians are background verified</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-slate-700">Clear pricing explained before service</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-slate-700">No hidden charges</p>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <p className="text-sm text-slate-700">Customer support available throughout the service process</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </main>
  );
}
