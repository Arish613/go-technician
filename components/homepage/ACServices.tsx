import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const services = [
  {
    title: "AC Jet Service",
    description: "Deep cleaning service for optimal AC performance",
    image: "/services/ac-services/ac-jet-services.png",
  },
  {
    title: "Gas Refilling",
    description: "Professional gas refilling for cooling efficiency",
    image: "/services/ac-services/ac-gas-refilling.png",
  },
  {
    title: "Annual Service Plans",
    description: "Comprehensive maintenance plans for year-round comfort",
    image: "/services/ac-services/ac-annual-charges.png",
  },
  {
    title: "AC Repair",
    description: "Fast and reliable repair for all AC issues",
    image: "/services/ac-services/ac-repair.png",
  },
];

export function ACServices() {
  return (
    <section id="ac-services" className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Air Conditioner Services
            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group cursor-pointer overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
