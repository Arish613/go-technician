"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { SubService, Product } from "@prisma/client";

// Unified cart item base — fields required for display & checkout
export interface CartItemBase {
  id: string;
  name: string;
  price: number;
  // SubService-specific (optional for Product)
  discountedPrice?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  // Product-specific (optional for SubService)
  discountPrice?: number | null;
  image?: string | null;
  brand?: string | null;
  condition?: string | null;
  // item type so we can differentiate if needed
  itemType: "service" | "product";
}

export interface CartItem extends CartItemBase {
  quantity: number;
}

// Helper to map SubService → CartItemBase
// Accepts optional city-specific price overrides so the cart reflects the correct price
export function subServiceToCartItem(
  s: SubService,
  effectivePrice?: number,
  effectiveDiscountedPrice?: number | null
): CartItemBase {
  return {
    id: s.id,
    name: s.name,
    price: effectivePrice ?? s.price,
    discountedPrice: effectiveDiscountedPrice !== undefined ? effectiveDiscountedPrice : s.discountedPrice,
    description: s.description,
    imageUrl: s.imageUrl,
    itemType: "service",
  };
}

// Helper to map Product → CartItemBase
export function productToCartItem(p: Product): CartItemBase {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    discountPrice: p.discountPrice,
    image: p.image,
    brand: p.brand,
    condition: p.condition,
    itemType: "product",
  };
}

// Get effective price (handles both SubService discountedPrice and Product discountPrice)
export function getEffectivePrice(item: CartItemBase): number {
  if (item.itemType === "service" && item.discountedPrice) {
    return item.discountedPrice;
  }
  if (item.itemType === "product" && item.discountPrice) {
    return item.discountPrice;
  }
  return item.price;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItemBase) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItemBase) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + getEffectivePrice(item) * item.quantity;
    }, 0);
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
