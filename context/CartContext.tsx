"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { SubService } from "@prisma/client";

export interface CartItem extends SubService {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (service: SubService) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (service: SubService) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === service.id);

      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...service, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== serviceId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
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
