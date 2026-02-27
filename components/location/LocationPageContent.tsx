import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubServiceCard } from "@/components/service/subservice/SubServiceCard";
import Link from "next/link";
import { ServiceContent } from "@/components/service/Content";
import { ServiceReviews } from "@/components/service/subservice/Reviews";
import { WhyChooseUs } from "@/components/service/subservice/WhyChooseUs";
import { StickyCart } from "@/components/cart/StickyCart";
import { AMCComparisonTable } from "@/components/service/AMCTable";
import { Star } from "lucide-react";
import { Benefit } from "@/components/service/subservice/Benefit";
import { RecentBlogs } from "@/components/blog/RecentBlogs";
import type { ServiceWithRelations } from "@/types/service";
import type { Review, LocationPage, LocationPageFaq } from "@prisma/client";

type LocationPageWithFaqs = LocationPage & {
  faqs: LocationPageFaq[];
};

interface LocationPageContentProps {
  locationPage: LocationPageWithFaqs;
  service: ServiceWithRelations;
  reviews: Review[] | null;
}

function formatLocationName(location: string): string {
  return location
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function LocationPageContent({
  locationPage,
  service,
  reviews,
}: LocationPageContentProps) {
  const hasTypes = service.type.length > 0;

  const averageRating =
    reviews && reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + Number(review.rating), 0) /
          reviews.length
        ).toFixed(2)
      : "0.00";

  const showAMCTable = locationPage.serviceSlug
    .toLowerCase()
    .includes("ac-repair");

  const locationName = formatLocationName(locationPage.location);

  return (
    <div className="min-h-screen">
      <StickyCart />
      <div className="lg:grid md:grid-cols-2">
        {/* Hero Section */}
        <section className="lg:sticky lg:top-10 lg:h-screen lg:mt-10">
          <div className="md:mx-20">
            <div className="gap-6 items-center">
              {service.imageUrl && (
                <div className="w-full max-h-56 md:max-h-125 lg:max-h-175 overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={locationPage.title}
                    width={1000}
                    height={700}
                    priority
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}
            </div>
            {service.benefits && service.benefits.length > 0 && (
              <Benefit
                benefits={service.benefits}
                serviceName={service.name}
              />
            )}
          </div>
        </section>

        {/* Sub Services Section */}
        <section
          id="services"
          className="py-6 md:py-10 col-span-2 lg:col-span-1"
        >
          <div className="md:mx-20 px-4">
            <div className="space-y-3 mb-6">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                {locationPage.title}
              </h1>

              <p className="text-sm md:text-base text-muted-foreground">
                {locationPage.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-0">
                <Link
                  href={`/service/${service.slug}/reviews`}
                  className="flex items-center gap-2 group"
                >
                  <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  <span className="font-bold text-base">
                    {averageRating}/5
                  </span>
                  <span className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors">
                    ({reviews?.length || 0} Review
                    {reviews?.length !== 1 ? "s" : ""})
                  </span>
                </Link>
              </div>
            </div>

            {hasTypes ? (
              <Tabs defaultValue={service.type[0]} className="w-full">
                <div className="sticky top-0 z-20 bg-white py-4">
                  <TabsList
                    className="grid w-full max-w-md mx-auto gap-2 p-0 bg-transparent"
                    style={{
                      gridTemplateColumns: `repeat(${service.type.length}, 1fr)`,
                    }}
                  >
                    {service.type.map((type) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="md:h-12 max-sm:text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-black data-[state=active]:border-primary border-2 border-gray-300 rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-black transition-all"
                      >
                        {type}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {service.type.map((type) => {
                  const filteredSubServices = service.subServices
                    .filter((sub) => sub.type === type)
                    .sort((a, b) => {
                      if (a.order != null && b.order != null)
                        return a.order - b.order;
                      if (a.order != null) return -1;
                      if (b.order != null) return 1;
                      return 0;
                    });

                  return (
                    <TabsContent key={type} value={type} className="space-y-6">
                      {filteredSubServices.length > 0 ? (
                        <div className="flex flex-col gap-10 md:gap-5">
                          {filteredSubServices.map((subService) => (
                            <SubServiceCard
                              key={subService.id}
                              subService={subService}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">
                            No services available for {type} at the moment.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            ) : (
              <div className="flex flex-col gap-10 md:gap-5">
                {service.subServices.map((subService) => (
                  <SubServiceCard
                    key={subService.id}
                    subService={subService}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Why choose us */}
      {service.whyChooseUs && (
        <WhyChooseUs
          service={{ name: service.name, whyChooseUs: service.whyChooseUs }}
        />
      )}

      {reviews && reviews.length > 0 && (
        <ServiceReviews reviews={reviews} serviceSlug={service.slug} />
      )}

      {/* Location-specific Content */}
      <section className="pb-10 pt-0 md:py-12 md:px-10 bg-muted/30">
        <div className="md:mx-20 px-4">
          <ServiceContent html={locationPage.content} maxHeight={400} />
        </div>
      </section>

      {/* Location-specific FAQs */}
      {locationPage.faqs.length > 0 && (
        <section id="faqs" className="py-12 md:py-16 md:mx-20 px-4">
          <div className="container mx-auto px-4">
            <div className="text-center mb-5 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground">
                Find answers to common questions about{" "}
                {service.name.toLowerCase()} in {locationName}
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {locationPage.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="md:py-4 text-left text-xs md:text-base font-semibold text-slate-900 hover:no-underline cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="md:pb-4 text-xs md:text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section>{showAMCTable && <AMCComparisonTable />}</section>

      <section className="md:mx-20 px-4">
        <RecentBlogs />
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book our professional {service.name.toLowerCase()} in {locationName}{" "}
            and experience quality service at your doorstep
          </p>
          <Link href={"/contact"} prefetch={true}>
            <Button size="lg" variant="secondary">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
