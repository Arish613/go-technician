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
import { SubServiceCard } from "@/components/service/SubServiceCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ServiceContent } from "@/components/service/Content";
import { getReviewsByService } from "@/lib/action/review";
import { ServiceReviews } from "@/components/service/Reviews";
import { WhyChooseUs } from "@/components/service/WhyChooseUs";
import { StickyCart } from "@/components/cart/StickyCart";
import { AMCComparisonTable } from "@/components/service/AMCTable";

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

  const showAMCTable = resolvedParams.service.toLowerCase().includes("ac");

  return (
    <div className="min-h-screen">
      <StickyCart />
      <div className="grid grid-cols-2">
        {/* Hero Section - Reduced height */}
        <section className="sticky top-10 h-screen mt-10 hidden lg:block">
          <div className="md:mx-20 px-4">
            <div className=" gap-6  items-center">
              {service.imageUrl && (
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  width={1000}
                  height={700}
                  priority
                  className="w-full"
                />

              )}
            </div>
          </div>
        </section>
        {/* Sub Services Section - Reduced top padding */}
        <section id="services" className="py-6 md:py-10 col-span-2 lg:col-span-1">
          <div className=" md:mx-20 px-4">
            <div className="space-y-2 text-center mb-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {service.name}
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground">
                {service.description}
              </p>
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
              <div className="flex flex-col gap-5">
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
