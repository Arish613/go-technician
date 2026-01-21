"use client";

import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const desktopBanners = [
  { src: "/banners/desktop/banner1.png", alt: "Say Goodbye to Repair Expenses with Extended Warranty" },
  { src: "/banners/desktop/banner2.png", alt: "Expert Care For Your Devices" },
];

const mobileBanners = [
  { src: "/banners/mobile/banner1.png", alt: "Say Goodbye to Repair Expenses with Extended Warranty" },
  { src: "/banners/mobile/banner2.png", alt: "Expert Care For Your Devices" },
];

export function Hero() {
  const plugin = React.useRef(Autoplay({ delay: 4000 }));

  return (
    <section className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="gap-8 px-0 pb-12">
        {/* Desktop Carousel */}
        <div className="mb-8 hidden md:block">
          <Carousel plugins={[plugin.current]} opts={{ loop: true }}>
            <CarouselContent>
              {desktopBanners.map((banner, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full h-48 md:h-[225px] overflow-hidden shadow-lg">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Mobile Carousel */}
        <div className="mb-8 md:hidden">
          <Carousel plugins={[plugin.current]} opts={{ loop: true }}>
            <CarouselContent>
              {mobileBanners.map((banner, idx) => (
                <CarouselItem key={idx}>
                  <div className="relative w-full h-48 overflow-hidden shadow-lg">
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      priority={idx === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="py-10 md:py-28">
          <h1 className="text-center text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">
            Expert Care For Your Devices
          </h1>
          <p className="text-center text-sm md:text-xl text-slate-700 mb-6">
            Fast, reliable home & appliance services from trusted professionals.
          </p>
          <div className="relative md:mx-auto flex w-full max-w-xl items-center rounded-full bg-white shadow-lg shadow-blue-900/5 ring-1 ring-slate-200/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 hover:shadow-xl">

            {/* Input Field */}
            <Input
              type="text"
              placeholder="Search 'AC service'"
              className="flex-1 border-0 bg-transparent py-4 pl-6 pr-4 text-base text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 md:text-[16px]  "
            />

            {/* Search Button */}
            <div className="p-1.5 pr-3">
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}