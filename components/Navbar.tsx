import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { PhoneCall, MapPin } from "lucide-react";
// import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blog" },
  { name: "Services", href: "#services" },
  { name: "Buy", href: "#buy" },
  { name: "Sell", href: "#sell" },
  { name: "My bookings", href: "#bookings" },
  { name: "Profile", href: "#profile" },
];

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="relative h-10 w-10">
              <svg viewBox="0 0 40 40" className="h-full w-full">
                <path
                  d="M10 8 L20 2 L30 8 L30 20 L20 26 L10 20 Z"
                  fill="#7c3aed"
                  className="fill-purple-600"
                />
                <path
                  d="M15 12 L20 9 L25 12 L25 18 L20 21 L15 18 Z"
                  fill="#a78bfa"
                  className="fill-purple-400"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">
              GO TECHNICIANS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-purple-600"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        {/* <div className="hidden items-center gap-3 lg:flex">
          <Button size={"icon-lg"} className="gap-2 rounded-full " asChild>
            <Link href="tel:+919999999999">
              <PhoneCall className="h-4 w-4" />
              Book on call
            </Link>
          </Button>
        </div> */}

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <svg
            className="h-6 w-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </nav>
    </header>
  );
}
