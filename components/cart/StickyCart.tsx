"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDialog } from "@/components/cart/CartDialog";
import { useState } from "react";

export function StickyCart() {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <div className="fixed top-20 right-4 z-50 ">
        <Button
          size="lg"
          onClick={() => setCartOpen(true)}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow relative cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5 " />
          {/* <span className="font-semibold">Cart</span> */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
      
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}