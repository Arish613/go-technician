"use client";

import { useState, useMemo } from "react";
import { Prisma } from "@prisma/client";
import { FilterSidebar, SortOption } from "@/components/second-hand/FilterSidebar";
import { ProductCard } from "@/components/second-hand/ProductCard";
import { ShieldCheck, Clock, BadgeCheck, RefreshCw, Phone, Wrench, Sparkles, Award, MapPin, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { city: true; locality: true };
}>;

interface SecondHandClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    image?: string;
    isVisible: boolean;
    content?: string;
    whyChooseUs?: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
    faqs?: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  };
  initialProducts: ProductWithRelations[];
}

const ICONS: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-primary" />,
  BadgeCheck: <BadgeCheck className="h-6 w-6 text-primary" />,
  Clock: <Clock className="h-6 w-6 text-primary" />,
  RefreshCw: <RefreshCw className="h-6 w-6 text-primary" />,
  Phone: <Phone className="h-6 w-6 text-primary" />,
  Wrench: <Wrench className="h-6 w-6 text-primary" />,
  Sparkles: <Sparkles className="h-6 w-6 text-primary" />,
  Award: <Award className="h-6 w-6 text-primary" />,
};

function renderIcon(icon?: string) {
  if (!icon) return ICONS.ShieldCheck;
  return ICONS[icon] || ICONS.ShieldCheck;
}

const WHY_US_ITEMS = [
  {
    icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
    bgColor: "bg-green-100",
    title: "90-Day Warranty",
    description: "Full coverage for all electrical and mechanical components.",
  },
  {
    icon: <BadgeCheck className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-blue-100",
    title: "Multi-point Inspection",
    description: "Rigorous check by our expert technicians.",
  },
  {
    icon: <Truck className="h-5 w-5 text-yellow-600" />,
    bgColor: "bg-yellow-100",
    title: "Cash on Delivery (COD)",
    description: "Pay for your order conveniently at the time of delivery.",
  },
  {
    icon: <MapPin className="h-5 w-5 text-pink-600" />,
    bgColor: "bg-pink-100",
    title: "All Over Mumbai",
    description: "Service and delivery available across all areas of Mumbai.",
  },
];

export function SecondHandClient({ category, initialProducts }: SecondHandClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [sort, setSort] = useState<SortOption>("popularity");

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    switch (sort) {
      case "price-asc":
        return copy.sort((a, b) => {
          const pa = a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
          const pb = b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;
          return pa - pb;
        });
      case "price-desc":
        return copy.sort((a, b) => {
          const pa = a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price;
          const pb = b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price;
          return pb - pa;
        });
      case "newest":
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "popularity":
      default:
        return copy.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
  }, [filteredProducts, sort]);

  const availableCount = filteredProducts.filter((p) => p.isAvailable).length;

  return (
    <div className="min-h-screen">


      {/* Main Content with Filters */}
      <section className="px-4 py-5">
        <div className="md:max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Filter Sidebar */}
            <FilterSidebar
              products={initialProducts}
              onFilterChange={setFilteredProducts}
              sort={sort}
              onSortChange={setSort}
            />

            {/* Product Grid */}
            <div className="flex-1">
              {/* Header Section */}
              <section className="py-5">
                <div className="md:max-w-7xl mx-auto">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Second Hand {category.name.replace(/^Buy\s+Second Hand\s+/i, "")}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Found {availableCount} verified unit{availableCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </section>
              {/* Sort Bar (desktop) */}
              <div className="hidden lg:flex justify-end items-center mb-8">
                <div className="flex items-center gap-3 bg-muted px-4 py-2 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By</span>
                  <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                    <SelectTrigger className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer w-[180px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              {sortedProducts.length > 0 ? (
                <>
                  {/* Desktop Grid */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Mobile Grid (compact) */}
                  <div className="grid grid-cols-2 gap-3 sm:hidden">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} compact />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No products match your filters. Try adjusting your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/50 rounded-[2rem] px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold tracking-tight">
              Why Buy Certified From Us?
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US_ITEMS.map((item, idx) => (
              <Card
                key={idx}
                className="flex flex-col items-center text-center gap-4 p-6 bg-card shadow-md border border-border/10"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.bgColor}`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy from Us (Category Specific) */}
      {category.whyChooseUs && category.whyChooseUs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                Why Buy Second Hand{" "}
                <span className="text-primary">{category.name.replace(/^Buy\s+Second Hand\s+/i, "")}</span>{" "}
                from Us?
              </h2>
              <p className="text-muted-foreground">
                Experience reliability, transparency, and value with every purchase.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.whyChooseUs.map((item, idx) => (
                <Card
                  key={idx}
                  className="group relative h-full bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300">
                      {renderIcon(item.icon)}
                    </div>
                    <h3 className="text-lg font-bold leading-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {category.faqs && category.faqs.length > 0 && (
        <section id="faqs" className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">

                <h2 className="text-4xl font-extrabold tracking-tighter mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mb-8">
                  Can&apos;t find what you&apos;re looking for? Our team is available to help you pick the perfect product.
                </p>
                <Link href="/contact" prefetch={true}>
                  <Button variant="outline" className="px-8 font-bold border-primary text-primary hover:bg-primary hover:text-white">
                    Talk to Expert
                  </Button>
                </Link>
              </div>
              <div className="lg:col-span-8 space-y-4">
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, idx) => (
                    <AccordionItem
                      key={faq.id || idx}
                      value={`item-${idx}`}
                      className="bg-card rounded-xl overflow-hidden px-6 border border-transparent hover:border-border/20 transition-all"
                    >
                      <AccordionTrigger className="py-4 text-left font-semibold hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Can&apos;t find what you need? Contact us and we&apos;ll help you find the best second-hand {category.name.toLowerCase()} for your budget.
          </p>
          <Link href="/contact" prefetch={true}>
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
