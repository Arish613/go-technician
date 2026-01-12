import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "AC Repair",
    icon: "/icons/ac-repair.png",
    badge: "Starts ₹149",
    badgeColor: "bg-green-600",
    link: "/service/ac-service",
  },
  {
    name: "Laptop Service",
    icon: "/icons/laptop-service.png",
    badge: "Upto 30% Off",
    badgeColor: "bg-green-600",
  },
  {
    name: "Refrigerator Repair",
    icon: "/icons/refrigerator-repair.png",
  },
  {
    name: "Home Cleaning",
    icon: "/icons/home-cleaning.png",
  },
  {
    name: "Washing Machine Repair",
    icon: "/icons/washing-machine.png",
  },
  {
    name: "Plumbing",
    icon: "/icons/plumbing.png",
  },
];

export function Services() {
  return (
    <section id="services" className="border-t border-slate-200 bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Our Services
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Explore What We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Discover a wide range of home and appliance services provided by
            trusted professionals. Quality service, transparent pricing, and
            customer satisfaction guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {categories.map((category) => {
            const cardContent = (
              <div className="group flex cursor-pointer flex-col items-center gap-4">
                {/* Circular Image Container */}
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-105">
                  {/* Badge */}
                  {category.badge && (
                    <span className="absolute left-0 top-0 -translate-x-1 translate-y-2 rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                      {category.badge}
                    </span>
                  )}

                  {/* Icon/Image */}
                  <div className="relative h-24 w-24">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Text Label */}
                <p className="max-w-40 text-center text-sm font-medium leading-tight text-slate-900 group-hover:text-blue-600">
                  {category.name}
                </p>
              </div>
            );

            return category.link ? (
              <Link
                key={category.name}
                href={category.link}
                className="mx-auto"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={category.name} className="mx-auto">
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600">
            Want to explore more services?{" "}
            <Link
              href="/service"
              prefetch={true}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Services
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
