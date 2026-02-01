import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "AC Repair",
    icon: "/icons/ac-repair.png",
    badge: "Starts ₹199",
    badgeColor: "bg-green-600",
    link: "/service/ac-repair-service",
  },
  {
    name: "Laptop Service",
    icon: "/icons/laptop-service.png",
    badgeColor: "bg-green-600",
    link: "/service/laptop-repair",
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
    link: "/service/washing-machine-repair",
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
          <p className="max-sm:hidden mx-auto text-sm mt-4 max-w-2xl md:text-base text-slate-600">
            Discover a wide range of home and appliance services provided by
            trusted professionals. Quality service, transparent pricing, and
            customer satisfaction guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-y-10 gap-x-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3">
          {categories.map((category) => {
            const cardContent = (
              <div className="group flex cursor-pointer flex-col items-center gap-4">
                {/* Circular Image Container */}
                <div className="relative flex md:h-32 md:w-32 items-center justify-center rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-105">
                  {/* Badge */}
                  {category.badge && (
                    <span className="md:text-center absolute -right-1 -top-1 md:left-0 md:top-0 md:-translate-x-1 md:translate-y-1 rounded bg-red-500 px-1.5 py-0.5 md:px-2 text-[10px] md:text-xs font-bold text-white shadow-md whitespace-nowrap">
                      {category.badge}
                    </span>
                  )}

                  {/* Icon/Image */}
                  <div className="relative md:h-24 md:w-24 h-16 w-16">
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
