import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

const services = [
  {
    title: "AC Jet Service",
    description: "Deep cleaning with jet pump for 2x cooling efficiency.",
    image: "/services/ac-services/ac-jet-services.png",
  },
  {
    title: "Gas Refilling",
    description: "Complete gas top-up & leak identification check.",
    image: "/services/ac-services/ac-gas-refilling.png",
  },
  {
    title: "Annual Maintenance",
    description: "2 services/year + breakdown support included.",
    image: "/services/ac-services/ac-annual-charges.png",
  },
  {
    title: "AC Repair",
    description: "Detailed diagnosis & quick resolution for all issues.",
    image: "/services/ac-services/ac-repair.png",
  },
];

export function ACServices() {
  return (
    <section
      id="ac-services"
      className="bg-slate-50 py-20 relative overflow-hidden"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Expert AC Services
          </h2>
          <p className="text-slate-600 text-sm md:text-lg">
            Keep your home cool and comfortable with our trusted repair and
            maintenance packages.
          </p>
        </div>

        {/* Services Grid */}
        <div className="relative px-2 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {services.map((service, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/3"
                >
                  <Link
                    href="/service/ac-repair-service"
                    className="group block h-full no-underline"
                    prefetch={true}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Image Container - Rounded & Aspect Ratio Fixed */}
                      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>

                      {/* Text Content - Simple & Clean */}
                      <div>
                        <h3 className="text-sm md:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
            <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
