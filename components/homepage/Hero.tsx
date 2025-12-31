import { Search } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";

const categories = [
  {
    name: "AC Repair",
    icon: "/icons/ac-repair.jpg",
    badge: "Starts ₹149",
    badgeColor: "bg-green-600",
    link: "/service/ac-service",
  },
  {
    name: "Laptop Service",
    icon: "/icons/laptop-service.jpg",
    badge: "Upto 30% Off",
    badgeColor: "bg-green-600",
  },
  {
    name: "Appliances Repair",
    icon: "/icons/appliance-repair.jpg",
  },
  {
    name: "Home Cleaning",
    icon: "/icons/home-cleaning.jpg",
  },
  {
    name: "Laundry",
    icon: "/icons/laundry.jpg",
  },
  {
    name: "Plumbing",
    icon: "/icons/plumbing.jpg",
  },
];

export function Hero() {
  return (
    <section className="bg-white md:mx-20">
      <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
            <Input
              type="text"
              placeholder="Search 'AC service'"
              className="border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
            />
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          <div>
            <h3 className="mb-4 text-center text-xl font-bold text-purple-600">
              EXPLORE
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const cardContent = (
                  <Card className="relative cursor-pointer border-slate-200 transition-all hover:border-purple-300 hover:shadow-md">
                    {category.badge && (
                      <Badge
                        className={`absolute top-0 left-2 ${category.badgeColor} text-xs text-white`}
                      >
                        {category.badge}
                      </Badge>
                    )}
                    <CardContent className="flex flex-col items-center gap-3 p-4">
                      <div className="relative h-20 w-20 rounded-lg bg-slate-100 p-3">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-center text-sm font-semibold text-slate-900">
                        {category.name}
                      </p>
                    </CardContent>
                  </Card>
                );

                return category.link ? (
                  <Link key={category.name} href={category.link}>
                    {cardContent}
                  </Link>
                ) : (
                  <div key={category.name}>{cardContent}</div>
                );
              })}
            </div>
          </div>
        </div>
        <Card className="relative overflow-hidden border-0 bg-linear-to-br from-slate-100 to-slate-200 shadow-xl">
          <CardContent className="p-0">
            <div className="relative grid grid-cols-2 gap-2 p-4">
              {/* Top Left - AC Service */}
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src="/hero/ac-service.jpg"
                  alt="AC Service"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Top Right - Office Discussion */}
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src="/hero/office-discussion.jpg"
                  alt="Office Discussion"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Left - Laptop Repair */}
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src="/hero/laptop-repair.jpg"
                  alt="Laptop Repair"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Bottom Right - Home Cleaning */}
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src="/hero/home-cleaning.jpg"
                  alt="Home Cleaning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 via-black/30 to-transparent p-6 text-center text-white">
              <h2 className="text-2xl font-bold leading-tight">
                EVERY SERVICE YOUR HOME NEEDS
                <br />
                <span className="text-purple-400">IN ONE PLACE!</span>
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
