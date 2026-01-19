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
    title: "AC Repair (Visit)",
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
          <p className="text-slate-600 text-lg">
            Keep your home cool and comfortable with our trusted repair and
            maintenance packages.
          </p>
        </div>

        {/* Services Grid */}
        <div className="">
          <Carousel>
            <CarouselContent>
              {services.map((service, index) => (

                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 ">
                  <Link
                    href="/service/ac-repair-service"
                    key={index}
                    className="no-underline"
                  >
                    <Card
                      key={index}
                      className="group relative flex flex-col border-slate-200 bg-white shadow-sm transition-all duration-300 overflow-hidden mx-5"
                    >
                      {/* Image Section */}
                      <div className="overflow-hidden bg-slate-100">
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={160}
                          height={120}
                          className="w-full "
                        />
                      </div>

                      {/* Content Section */}
                      <CardContent className="grow p-5 pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {service.title}
                          </h3>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>

              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:left-4 w-10 h-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-1 shadow md:right-4 w-10 h-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
