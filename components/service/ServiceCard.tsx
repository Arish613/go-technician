import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ServiceWithRelations } from "@/types/service";

interface ServiceCardProps {
  service: ServiceWithRelations;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const activeSubServices = service.subServices.filter((s) => s.isActive);
  const minPrice = activeSubServices.length
    ? Math.min(...activeSubServices.map((s) => s.discountedPrice || s.price))
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group max-sm:p-0">
      <Link href={`/service/${service.slug}`} >
        {service.imageUrl && (
          <div className="relative h-32 md:h-48 w-full overflow-hidden">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className=" object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {service.location && (
              <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {service.location}
              </Badge>
            )}
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-sm md:text-xl">{service.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-[14px]">
            {service.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm ">
            <div className="md:flex items-center gap-1 text-muted-foreground  hidden">
              <Package className="w-4 h-4" />
              <span>
                {activeSubServices.length} service
                {activeSubServices.length !== 1 ? "s" : ""}
              </span>
            </div>
            {minPrice && (
              <div className="font-semibold text-primary md:text-[14px]" >
                Starting at ₹{minPrice}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4">
        <Button asChild className="w-full group " >
          <Link href={`/service/${service.slug}`}>
            View Services
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
