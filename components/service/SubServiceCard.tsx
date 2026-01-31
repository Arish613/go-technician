"use client";

import { Clock, Info, } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Button } from "../ui/button";
import { SubService } from "@prisma/client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubServiceCardProps {
  subService: SubService;
}

export function SubServiceCard({ subService }: SubServiceCardProps) {
  const { addToCart, removeFromCart, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const alreadyInCart = items.some((item) => item.id === subService.id);

  const hasDiscount =
    subService.discountedPrice && subService.discountedPrice < subService.price;

  const handleAddToCart = () => {
    if (!alreadyInCart) {
      addToCart(subService);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(subService.id);
  };

  return (
    <div
      id={`service-${subService.id}`}
      data-subservice-id={subService.id}
      className="relative bg-card rounded-lg overflow-hidden scroll-mt-24 px-4 subservice"
    >
      <div className="flex flex-row md:items-center gap-4">
        {/* Left: Content */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-lg font-semibold line-clamp-2">
                {subService.name}
              </h3>
              {/* {subService.isPopular && (
                <Badge className="bg-orange-500 text-xs py-0 px-2 shrink-0">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )} */}

              {/* Info Dialog */}
              {(subService.whatIncluded.length > 0 || subService.whatExcluded.length > 0) && (
                <SubServiceDialog subService={subService} />
              )}
            </div>
            <p className="text-[11px] md:text-sm text-muted-foreground line-clamp-2">
              {subService.description}
            </p>
          </div>

          {/* Pricing & Duration */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-2xl font-bold text-primary">
                ₹{hasDiscount ? subService.discountedPrice : subService.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{subService.price}
                  </span>
                  <Badge variant="secondary" className="max-sm:text-[10px]">
                    Save ₹{subService.price - (subService.discountedPrice || 0)}
                  </Badge>
                </>
              )}
            </div>
            {subService.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {subService.duration}
              </span>
            )}
          </div>
        </div>

        {/* Right: Image & Button */}
        <div className="flex flex-col items-center gap-2 max-sm:max-w-25  md:min-w-50">
          {subService.imageUrl && (

            <Image
              src={subService.imageUrl}
              alt={subService.name}
              width={200}
              height={200}
              className="max-sm:w-32"
            />

          )}

          {alreadyInCart ? (
            <div className="flex gap-2 w-full md:w-[80%]">
              <Button
                variant="destructive"
                className="flex-1 cursor-pointer text-xs"
                onClick={handleRemoveFromCart}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              // size={"sm"}
              className="text-xs md:text-[0.8rem] w-full md:w-auto px-8 cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleAddToCart}
            >
              Add To Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SubServiceDialog({ subService }: { subService: SubService }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          <Info className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="md:max-w-md overflow-y-auto max-sm:max-h-[80vh]">
        <DialogHeader>
          {subService.imageUrl && (
            <Image
              src={subService.imageUrl}
              alt={subService.name}
              width={400}
              height={300}

            />
          )}
          <DialogTitle>{subService.name}</DialogTitle>
          <DialogDescription>
            {subService.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* What's Included */}
          {subService.whatIncluded.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="text-green-600">✓</span> What&apos;s Included
              </h4>
              <ul className="space-y-1.5">
                {subService.whatIncluded.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What's Excluded */}
          {subService.whatExcluded.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <span className="text-red-600">✗</span> What&apos;s Not Included
              </h4>
              <ul className="space-y-1.5">
                {subService.whatExcluded.map((item, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}