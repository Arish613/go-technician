"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  onCartClick?: () => void;
  cartItemCount?: number;
}

export function MobileNav({ navLinks, onCartClick, cartItemCount = 0 }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {/* Cart Icon for Mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onCartClick}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="flex flex-col gap-6 py-6 ml-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-slate-900">
              Menu
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8"
            ></Button>
          </div>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={true}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-slate-700 transition-colors hover:text-blue-600 py-2 px-4 rounded-md hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
    </div>
  );
}
