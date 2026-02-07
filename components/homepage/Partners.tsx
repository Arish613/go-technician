"use client";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const partners = [
  {
    name: "Samsung",
    logo: "/partners/samsung.svg",
  },
  {
    name: "LG",
    logo: "/partners/lg.svg",
  },
  {
    name: "Whirlpool",
    logo: "/partners/whirlpool.svg",
  },
  {
    name: "Voltas",
    logo: "/partners/voltas.svg",
  },
  {
    name: "Daikin",
    logo: "/partners/daikin.svg",
  },
  {
    name: "Blue Star",
    logo: "/partners/bluestar.svg",
  },
  {
    name: "Godrej",
    logo: "/partners/godrej.svg",
  },
  {
    name: "Haier",
    logo: "/partners/haier.svg",
  },
];

function PartnerCard({ partner }: { partner: (typeof partners)[0] }) {
  return (
    <div className="group relative mx-4">
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm p-8 transition-all duration-500">
        {/* Logo container */}
        <div className="relative w-20 h-16 md:w-40 transition-all duration-500">
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function Partners() {
  return (
    <section id="partners" className="relative overflow-hidden md:py-24 mt-10">
      <div className="container relative mx-auto px-4">
        {/* Header with animated badge */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">
              Trusted By The Best
            </span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text">
            Brands We Repair & Service
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-lg text-slate-600 leading-relaxed">
            We repair and service all major brands, providing authorized service and genuine spare parts backed by certified technicians.
          </p>
        </div>

        {/* Partners Marquee - First Row (Left to Right) */}
        <div className="relative mb-4">
          <Marquee direction="left" speed={35} gap={24} pauseOnHover>
            {partners.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
