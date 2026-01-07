"use client";

import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const banners = [
  {
    src: "/banners/banner1.jpg",
    alt: "Say Goodbye to Repair Expenses with Extended Warranty",
  },
  {
    src: "/banners/banner2.jpg",
    alt: "Expert Care For Your Devices",
  },
];

export function Hero() {
  const plugin = React.useRef(Autoplay({ delay: 4000 }));

  return (
    <section className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="gap-8 px-0 pb-12">
        {/* Carousel Banner */}
        <div className="mb-8">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {banners.map((banner, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full h-48 md:h-64 overflow-hidden shadow-lg">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="(max-width: 768px) 100vw, 900px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className=" py-10 md:py-28">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">
            Expert Care For Your Devices
          </h1>

          <p className="text-center text-lg md:text-xl text-slate-700 mb-6">
            Fast, reliable home & appliance services from trusted professionals.
          </p>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 shadow-lg md:mx-auto md:w-2/3">
            <Input
              type="text"
              placeholder="Search 'AC service'"
              className="border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
