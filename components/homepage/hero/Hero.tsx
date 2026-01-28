"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServiceAndSubService } from "@/lib/action/service";

const desktopBanners = [
    // { src: "/banners/desktop/banner1.png", alt: "Say Goodbye to Repair Expenses with Extended Warranty" },
    { src: "/banners/desktop/banner3.png", alt: "Expert Care For Your Devices" },
    { src: "/banners/desktop/banner2.png", alt: "Expert Care For Your Devices" },

];

const mobileBanners = [
    // { src: "/banners/mobile/banner1.png", alt: "Say Goodbye to Repair Expenses with Extended Warranty" },
    { src: "/banners/mobile/banner3.png", alt: "Expert Care For Your Devices" },
    { src: "/banners/mobile/banner2.png", alt: "Expert Care For Your Devices" },

];

export function Hero() {
    const plugin = React.useRef(Autoplay({ delay: 4000 }));
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<{ type: string; name: string; slug: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    // Fetch results when user types
    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                const data = await getServiceAndSubService(query.trim());
                setResults(data);
                setShowDropdown(true);
                setIsLoading(false);
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // On form submit, navigate to first result or close dropdown
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (results.length > 0) {
            router.push(`/service/${results[0].slug}`);
            setShowDropdown(false);
            setQuery("");
        }
    };

    // On click, navigate to the service/subservice page
    const handleSelect = (slug: string) => {
        router.push(`/service/${slug}`);
        setShowDropdown(false);
        setQuery("");
    };

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
                <div className="py-10 md:py-20 px-5 md:px-0">
                    <h1 className="text-center text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">
                        Expert Care For Your Devices
                    </h1>
                    <p className="text-center text-sm md:text-xl text-slate-700 mb-6">
                        Fast, reliable home & appliance services from trusted professionals.
                    </p>
                    <form
                        className="relative md:mx-auto w-full max-w-xl"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <div className="flex items-center rounded-full bg-white shadow-lg shadow-blue-900/5 ring-1 ring-slate-200/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300 hover:shadow-xl">
                            <Input
                                type="text"
                                placeholder="Search 'AC service'"
                                className="flex-1 border-0 bg-transparent py-4 pl-6 pr-4 text-base text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 md:text-[16px]"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onFocus={() => results.length > 0 && setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                            <div className="p-1.5 pr-3">
                                <Button
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105"
                                    type="submit"
                                >
                                    <Search className="h-5 w-5" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            </div>
                        </div>

                        {/* Suggestions dropdown */}
                        {showDropdown && results.length > 0 && (
                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                                {results.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center justify-between"
                                        onClick={() => handleSelect(item.slug)}
                                    >
                                        <span className="text-slate-700 font-medium">{item.name}</span>
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded capitalize">
                                            {item.type}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Loading state */}
                        {isLoading && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 px-4 py-3 text-center text-slate-500">
                                Searching...
                            </div>
                        )}

                        {/* No results */}
                        {showDropdown && !isLoading && query.trim().length > 1 && results.length === 0 && (
                            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 px-4 py-3 text-center text-slate-500">
                                No services found
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}