"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDialog } from "@/components/cart/CartDialog";
import { useState } from "react";

export function StickyCart() {
  const { itemCount, getTotalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
        <Button
          size="lg"
          onClick={() => setCartOpen(true)}
          className="rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary px-5 py-2 h-auto group"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">
                {itemCount} {itemCount === 1 ? "Item" : "Items"}
              </span>
              <span className="text-xs opacity-90">₹{getTotalPrice()}</span>
            </div>
              {/* <div className="h-8 w-px bg-white/20 mx-2" />
              <span className="font-bold text-base">View Cart</span> */}
          </div>
        </Button>
      </div>

      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}