import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Second Hand AC",
    icon: "/icons/ac-repair.png",
    badge: "Best Deals",
    badgeColor: "bg-blue-600",
    link: "/buy-second-hand-air-conditioner-in-mumbai",
  },
  {
    name: "Second Hand Laptop",
    icon: "/icons/laptop-service.png",
    badge: "Starting ₹8,000",
    badgeColor: "bg-blue-600",
    link: "/buy-second-hand-laptop-in-mumbai",
  },
];

export function SecondHandProducts() {
  return (
    <section id="second-hand" className=" py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Second Hand Products
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Buy Verified Second Hand Products
          </h2>
          <p className="max-sm:hidden mx-auto mt-4 max-w-2xl text-sm md:text-base text-slate-600">
            Quality checked by our technicians. Genuine products with warranty
            available. Shop now for the best deals on pre-owned appliances.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-10 sm:gap-x-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
          {products.map((product) => {
            const cardContent = (
              <div className="group flex cursor-pointer flex-col items-center gap-4">
                <div className="relative flex md:h-30 md:w-30 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:scale-105 border-2 border-blue-100">
                  {product.badge && (
                    <span className="absolute -right-1 -top-1 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md whitespace-nowrap">
                      {product.badge}
                    </span>
                  )}

                  <div className="relative md:h-28 md:w-28 h-24 w-24">
                    <Image
                      src={product.icon}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>

                <p className="max-w-40 text-center text-sm font-medium leading-tight text-slate-900 group-hover:text-blue-600">
                  {product.name}
                </p>
              </div>
            );

            return product.link ? (
              <Link
                key={product.name}
                href={product.link}
                className="mx-auto"
                prefetch={true}
              >
                {cardContent}
              </Link>
            ) : (
              <div key={product.name} className="mx-auto">
                {cardContent}
              </div>
            );
          })}
        </div>
{/* 
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600">
            Want to explore more products?{" "}
            <Link
              href="/second-hand"
              prefetch={true}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              View All Products
            </Link>
          </p>
        </div> */}
      </div>
    </section>
  );
}
