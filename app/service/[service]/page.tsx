import { getServiceBySlug } from "@/lib/action/service";
import { notFound } from "next/navigation";
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
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ServiceContent } from "@/components/service/Content";
import { getReviewsByService } from "@/lib/action/review";
import { ServiceReviews } from "@/components/service/Reviews";
import { WhyChooseUs } from "@/components/service/WhyChooseUs";
import { StickyCart } from "@/components/cart/StickyCart";
import { AMCComparisonTable } from "@/components/service/AMCTable";
import { Star } from "lucide-react";

interface ServicePageProps {
  params: {
    service: string;
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const result = await getServiceBySlug(resolvedParams.service);

  if (!result.success || !result.data) {
    notFound();
  }

  const service = result.data;
  const hasTypes = service.type.length > 0;

  const reviews = await getReviewsByService(service.id);

  const averageRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + Number(review.rating), 0) / reviews.length).toFixed(2)
    : "0.00";

  const showAMCTable = resolvedParams.service.toLowerCase().includes("ac");

  return (
    <div className="min-h-screen">
      <StickyCart />
      <div className="lg:grid md:grid-cols-2">
        {/* Hero Section - Reduced height */}
        <section className="lg:sticky lg:top-10 lg:h-screen lg:mt-10">
          <div className="md:mx-20">
            <div className="gap-6 items-center">
              {service.imageUrl && (
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  width={1000}
                  height={700}
                  priority
                  className="w-full h-auto max-h-37.5 md:max-h-125 lg:max-h-full object-cover "
                />
              )}
            </div>
          </div>
        </section>
        {/* Sub Services Section - Reduced top padding */}
        <section id="services" className="py-6 md:py-10 col-span-2 lg:col-span-1">
          <div className=" md:mx-20 px-4">
            <div className="space-y-3 mb-6">
              {/* <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  9 Minutes
                </span>
                <span>Get a Verified AC Technician in</span>
              </div> */}

              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                {service.name}
              </h1>

              <p className="text-sm md:text-base text-muted-foreground">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-0">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  <span className="font-bold text-base">{averageRating}/5</span>
                  <span className="text-xs text-muted-foreground">
                    ({reviews?.length || 0} Review{reviews?.length !== 1 ? 's' : ''})
                  </span>
                </div>

                {/* <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">30812</span>
                  <span className="text-xs text-muted-foreground">Successful Bookings</span>
                </div> */}
              </div>

              {/* <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4 mt-4">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-full shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base text-orange-900 mb-1">
                      Best Price Guarantee
                    </h3>
                    <p className="text-xs md:text-sm text-orange-800">
                      Expert technicians with transparent pricing and reliable service. No Hidden Charges.
                    </p>
                  </div>
                </div>
              </div> */}
            </div>

            {hasTypes ? (
              <Tabs defaultValue={service.type[0]} className="w-full ">
                <div className="sticky top-0 z-20 bg-white py-4 ">
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
                  const filteredSubServices = service.subServices.filter(
                    (sub) => sub.type === type
                  );

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
                  <SubServiceCard key={subService.id} subService={subService} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      {/* Why choose us */}
      {service.whyChooseUs && (
        <WhyChooseUs service={{ name: service.name, whyChooseUs: service.whyChooseUs }} />
      )}

      {reviews && reviews.length > 0 && <ServiceReviews reviews={reviews} />}

      {/* Service Content */}
      <section className="py-10 md:py-12 md:px-10 bg-muted/30">
        <div className="md:mx-20 px-4">
          <ServiceContent html={service.content} maxHeight={400} />
        </div>
      </section>
      {/* FAQs Section */}
      {service.faqs.length > 0 && (
        <section id="faqs" className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our{" "}
                {service.name.toLowerCase()}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {service.faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <section>
        {showAMCTable && <AMCComparisonTable />}
      </section>
      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Book our professional {service.name.toLowerCase()} and experience
            quality service at your doorstep
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

// Generate static params for all services
export async function generateStaticParams() {
  const services = await prisma.services.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return services.map((service: { slug: string }) => ({
    service: service.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ServicePageProps) {
  const resolvedParams = await params;
  const result = await getServiceBySlug(resolvedParams.service);

  if (!result.success || !result.data) {
    return {
      title: "Service Not Found",
    };
  }

  const service = result.data;

  return {
    title: `${service.name} | Professional Services`,
    description: service.description,
    openGraph: {
      title: service.name,
      description: service.description,
      images: service.imageUrl ? [service.imageUrl] : [],
    },
    alternates: {
      canonical: `/service/${service.slug}`,
    },
  };
}
