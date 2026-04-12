"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { useCart, productToCartItem } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingCart, Star, Trash } from "lucide-react";

type ProductReview = {
  id: string;
  rating: string;
};

type Product = Prisma.ProductGetPayload<{
  include: { city: true; locality: true };
}> & {
  reviews?: ProductReview[];
  category?: { slug: string };
};

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

function extractCapacity(condition: string | null): string | null {
  if (!condition) return null;
  const match = condition.match(/(\d+\.?\d*)\s*ton/i);
  if (match) return `${match[1]} Ton`;
  return null;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart();
  const alreadyInCart = items.some((item) => item.id === product.id);
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    if (!alreadyInCart && product.isAvailable) {
      addToCart(productToCartItem(product));
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  const capacity = extractCapacity(product.condition);

  // Compute rating from reviews if available
  const reviews = product.reviews ?? [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviewCount
      : null;
  const categorySlug = product.category?.slug;

  if (compact) {
    return (
      <div className="bg-card rounded-xl overflow-hidden flex flex-col shadow-[0_12px_32px_rgba(11,28,48,0.06)] group">
        <div className="relative aspect-[4/3] bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover p-2 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Certified
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow subservice">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
            {product.brand} {capacity && `• ${capacity}`}
          </span>
          <h3 className="text-sm font-semibold leading-tight mb-2 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            {avgRating !== null ? (
              categorySlug ? (
                <Link
                  href={`/${categorySlug}/${product.id}/reviews`}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {avgRating.toFixed(1)} ({reviewCount})
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviewCount})
                </span>
              )
            ) : (
              <span className="text-xs text-muted-foreground">No reviews</span>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black">
                ₹{(product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-muted-foreground line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            {!product.isAvailable ? (
              <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>
            ) : alreadyInCart ? (
              <Button variant="destructive" size="sm" onClick={handleRemoveFromCart} className="h-8">
                <Trash className="h-3 w-3 mr-1" /> 
              </Button>
            ) : (
              <Button size="sm" onClick={handleAddToCart} className="h-8 bg-primary hover:bg-primary/90">
                <ShoppingCart className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(11,28,48,0.06)] group flex flex-col">
      <div className="relative h-48 bg-muted overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}
        {product.condition && <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
            {product.condition}
          </span>
        </div>}

      </div>
      <div className="p-5 flex flex-col flex-1">
        
        <h3 className="font-bold mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex justify-between items-start">
          {product.brand && (
            <Badge className="text-[10px] mb-2 bg-accent text-black">
              {product.brand} {capacity && `• ${capacity}`}
            </Badge>
          )}
          {product.specifications && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
              {product.specifications}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
          {avgRating !== null ? (
            categorySlug ? (
              <Link
                href={`/${categorySlug}/${product.id}/reviews`}
                className="text-xs text-muted-foreground hover:underline"
              >
                {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">
                {avgRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            )
          ) : (
            categorySlug ? (
              <Link
                href={`/${categorySlug}/${product.id}/reviews`}
                className="text-xs text-muted-foreground hover:underline"
              >
                No reviews yet
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">No reviews yet</span>
            )
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl font-bold text-primary">
              ₹{(product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-green-600">{discountPercent}% OFF</span>
              </>
            )}
          </div>
          {!product.isAvailable ? (
            <Badge variant="destructive" className="w-full justify-center py-2">Sold Out</Badge>
          ) : alreadyInCart ? (
            <Button variant="outline" onClick={handleRemoveFromCart} className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </Button>
          ) : (
            <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 shadow-md">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
