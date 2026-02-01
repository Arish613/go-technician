import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

const repairs = [
  {
    title: "Laptop Repair",
    image: "/icons/laptop-service.png",
  },
  {
    title: "Refrigerator",
    image: "/icons/refrigerator-repair.png",
  },
  {
    title: "Washing Machine",
    image: "/icons/washing-machine.png",
  },
  {
    title: "Plumbing",
    image: "/icons/plumbing.png",
  }
];

export function QuickRepairs() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            QUICK REPAIRS
          </p>
        </div>
        <h2 className="mb-2 text-center text-4xl font-bold text-slate-900">
          Book Quick Device Repairs Online
        </h2>
        <p className="mb-12 text-center text-sm md:text-lg text-slate-500">
          Hassle-free service at your doorstep
        </p>

        {/* Carousel */}
        <div className="relative px-2 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {repairs.map((item, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-4 basis-2/3 md:basis-1/3 lg:basis-1/3"
                >
                  <div className="flex flex-col items-center justify-center bg-blue-50 py-5 px-4 rounded-lg h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={150}
                      height={150}
                      className="object-contain max-sm:w-32 "
                    />
                    <p className="text-sm md:text-xl font-semibold text-slate-900 mt-4 ">
                      {item.title}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
            <CarouselNext className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-slate-200 bg-white shadow-md hover:bg-slate-50 hover:text-blue-600" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}