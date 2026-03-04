"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { useCart, productToCartItem } from "@/context/CartContext";
import Image from "next/image";
import { Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart();

  const alreadyInCart = items.some((item) => item.id === product.id);

  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;

  const handleAddToCart = () => {
    if (!alreadyInCart && product.isAvailable) {
      addToCart(productToCartItem(product));
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
  };

  return (
    <div
      id={`product-${product.id}`}
      className="relative bg-card rounded-lg overflow-hidden scroll-mt-24 px-4"
    >
      <div className="flex flex-row md:items-center gap-4">
        {/* Left: Content */}
        <div className="flex-1 space-y-3">
          {/* Title & label */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm md:text-lg font-semibold line-clamp-2">
                {product.name}
              </h3>
              {product.label && (
                <Badge variant="secondary" className="max-sm:text-[10px] flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.label}
                </Badge>
              )}
            </div>

            {/* Brand & condition */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && (
                <span className="text-[11px] md:text-sm text-muted-foreground">
                  Brand: <span className="font-medium text-foreground">{product.brand}</span>
                </span>
              )}
              {product.brand && product.condition && (
                <span className="text-muted-foreground text-xs">·</span>
              )}
              {product.condition && (
                <Badge
                  variant="outline"
                  className="text-[10px] md:text-xs font-normal"
                >
                  {product.condition}
                </Badge>
              )}
            </div>

            {/* Specifications */}
            {product.specifications && (
              <p className="text-[11px] md:text-sm text-muted-foreground line-clamp-2">
                {product.specifications}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-2xl font-bold text-primary">
                ₹{hasDiscount ? product.discountPrice : product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.price}
                  </span>
                  <Badge variant="secondary" className="max-sm:text-[10px]">
                    Save ₹{(product.price - (product.discountPrice ?? 0)).toFixed(0)}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Image & Button */}
        <div className="flex flex-col items-center gap-2 max-sm:max-w-25 md:min-w-50">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="max-sm:w-32 rounded-md object-cover"
            />
          ) : (
            <div className="w-32 h-24 md:w-48 md:h-36 bg-muted rounded-md flex items-center justify-center">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}

          {!product.isAvailable ? (
            <Badge variant="destructive" className="w-full text-center justify-center py-1">
              Sold Out
            </Badge>
          ) : alreadyInCart ? (
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
              className="text-xs md:text-[0.8rem] w-full md:w-auto px-8 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold hover:text-white"
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
