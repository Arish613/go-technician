import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const partners = [
  {
    name: "Samsung",
    logo: "/partners/samsung.png",
  },
  {
    name: "LG",
    logo: "/partners/lg.png",
  },
  {
    name: "Whirlpool",
    logo: "/partners/whirlpool.png",
  },
  {
    name: "Voltas",
    logo: "/partners/voltas.png",
  },
  {
    name: "Daikin",
    logo: "/partners/daikin.png",
  },
  {
    name: "Blue Star",
    logo: "/partners/bluestar.png",
  },
  {
    name: "Godrej",
    logo: "/partners/godrej.png",
  },
  {
    name: "Haier",
    logo: "/partners/haier.png",
  },
];

const trustedBy = [
  { value: "100+", label: "Brand Partners" },
  { value: "500+", label: "Corporate Clients" },
  { value: "30+", label: "Cities" },
];

export function Partners() {
  return (
    <section
      id="partners"
      className="border-t border-slate-200 bg-slate-50 py-16 mt-10"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Trusted By The Best
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Partners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            We work with leading brands and companies to provide authorized
            service and genuine spare parts for all your needs.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-8">
          {trustedBy.map((stat, index) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
              {index < trustedBy.length - 1 && (
                <div className="hidden h-12 w-px bg-slate-300 sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Partners Logo Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {partners.map((partner) => (
            <Card
              key={partner.name}
              className="border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="flex items-center justify-center p-6">
                <div className="relative h-12 w-full grayscale transition-all hover:grayscale-0">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Authorized Service Banner */}
        <Card className="mt-12 border-0 bg-linear-to-r from-blue-600 to-blue-700 shadow-lg">
          <CardContent className="p-8 text-center text-white">
            <h3 className="text-xl font-bold sm:text-2xl">
              Authorized Service Partner
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-blue-100">
              We are authorized service partners for major appliance and
              electronics brands. Get genuine spare parts, certified
              technicians, and manufacturer-backed warranty on all repairs.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">Genuine Parts</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">Certified Technicians</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <svg
                  className="h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">Brand Warranty</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Become a Partner CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600">
            Interested in partnering with us?{" "}
            <a
              href="#contact"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Become a Partner →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
