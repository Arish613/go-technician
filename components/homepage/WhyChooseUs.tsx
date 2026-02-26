import {
  Award,
  Clock,
  ShieldCheck,
  Wallet,
  HeadphonesIcon,
  CheckCircle2,
} from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "Every technician is background-verified and skilled-certified for your peace of mind.",
    color: "text-emerald-600",
  },
  {
    icon: Clock,
    title: "On-Time Service",
    description:
      "We value your time. Our technicians arrive on schedule, every time.",
    color: "text-blue-600",
  },
  {
    icon: Award,
    title: "30-Day Warranty",
    description:
      "All services come with a 30-day warranty. Quality work guaranteed.",
    color: "text-amber-600",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "No hidden charges. Get upfront pricing before you book any service.",
    color: "text-purple-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Need help? Our support team is available round the clock to assist you.",
    color: "text-cyan-600",
  },
];

export function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className=" border-slate-200 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 max-sm:text-center">
              Why Choose Us
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl max-sm:text-center">
              The Gotechnicians Advantage
            </h2>
            <p className="mt-4 text-sm md:text-base text-slate-600">
              Experience the difference with our commitment to quality,
              transparency, and customer satisfaction.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-blue-600">25,000+</div>
                <div className="mt-1 text-sm text-slate-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="mt-1 text-sm text-slate-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-bold text-blue-600">10+</div>
                <div className="mt-1 text-sm text-slate-600">Cities Covered</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className={`shrink-0 rounded-lg bg-slate-100 p-2.5`}>
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 ${reason.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 md:text-xl text-base">
                      {reason.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {reason.description}
                    </p>
                  </div>
                  <CheckCircle2 className="shrink-0 h-5 w-5 text-emerald-500" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
