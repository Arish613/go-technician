import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Check, Clock, X, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { SubService } from "@prisma/client";

interface SubServiceCardProps {
  subService: SubService;
}

export function SubServiceCard({ subService }: SubServiceCardProps) {
  const hasDiscount =
    subService.discountedPrice && subService.discountedPrice < subService.price;

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      {subService.isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-orange-500">
            <Star className="w-3 h-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}

      {subService.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={subService.imageUrl}
            alt={subService.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2">
          <span>{subService.name}</span>
        </CardTitle>
        <CardDescription>{subService.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            ₹{hasDiscount ? subService.discountedPrice : subService.price}
          </span>
          {hasDiscount && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{subService.price}
            </span>
          )}
          {subService.duration && (
            <span className="text-sm text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="w-4 h-4" />
              {subService.duration}
            </span>
          )}
        </div>

        {/* What's Included */}
        {subService.whatIncluded.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">What&apos;s Included:</p>
            <ul className="space-y-1">
              {subService.whatIncluded.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
              {subService.whatIncluded.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  +{subService.whatIncluded.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* What's Excluded */}
        {subService.whatExcluded.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Not Included:</p>
            <ul className="space-y-1">
              {subService.whatExcluded.slice(0, 2).map((item, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
