import { getServices } from "@/lib/action/service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ServicesFilter } from "@/components/service/ServiceFilter";
import { ServiceCard } from "@/components/service/ServiceCard";

interface ServicesPageProps {
  searchParams: Promise<{
    location?: string;
    search?: string;
  }>;
}

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  const params = await searchParams;
  const result = await getServices(params.location, true);

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">No Services Available</h1>
        <p className="text-muted-foreground">
          {result.error || "Please check back later"}
        </p>
      </div>
    );
  }

  let services = result.data;

  // Filter by search query
  if (params.search) {
    const query = params.search.toLowerCase();
    services = services.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );
  }

  // Get unique locations
  const locations = Array.from(
    new Set(services.map((s) => s.location).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Professional Home Services
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert technicians for all your home maintenance and repair needs
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Search for services..."
                className="pl-12 h-14 text-lg"
                defaultValue={params.search}
                name="search"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {services.length}+
                </div>
                <div className="text-sm text-muted-foreground">Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {services.reduce((acc, s) => acc + s.subServices.length, 0)}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Service Options
                </div>
              </div>
              {/* <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {locations.length}+
                </div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Services */}
      <section className="py-12 md:py-16">
        <div className="md:mx-20 px-4">
          {/* Filter Bar */}
          <ServicesFilter
            currentLocation={params.location}
            locations={locations}
          />

          {/* Services Grid */}
          {services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">No Services Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button asChild variant="outline">
                  <Link href="/service">Clear Filters</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get in touch with us and we&apos;ll help you find the perfect
            service for your needs
          </p>
          <Link href={"/contact"} className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Contact Us
            </Button>
            {/* <Button size="lg" className="border border-white">Request Service</Button> */}
          </Link>
        </div>
      </section>
    </div>
  );
}

// Generate metadata
export const metadata = {
  title: "Professional Home Services | Expert Technicians",
  description:
    "Browse our complete range of professional home services including AC repair, plumbing, electrical work, and more. Expert technicians at your doorstep.",
};
