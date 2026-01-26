"use client";

import Link from "next/link";
import { MobileNav } from "./MobileNav";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDialog } from "./cart/CartDialog";
import { useState } from "react";
import { Button } from "./ui/button";

const navLinks = [
  { name: "Blogs", href: "/blog" },
  { name: "Services", href: "/service" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 bg-white ">
        <nav className="md:mx-20 flex items-center justify-between px-4 py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Image
                src={"/logo.png"}
                alt="Logo"
                width={130}
                height={60}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className=" text-slate-700 transition-colors hover:text-blue-600 text-[14px] font-semibold"
                prefetch={true}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          <MobileNav 
            navLinks={navLinks} 
            onCartClick={() => setCartOpen(true)}
            cartItemCount={itemCount}
          />
        </nav>
      </header>
      
      <CartDialog open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
