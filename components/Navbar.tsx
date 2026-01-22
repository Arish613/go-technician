import Link from "next/link";
import { MobileNav } from "./MobileNav";
import Image from "next/image";

const navLinks = [
  { name: "Blogs", href: "/blog" },
  { name: "Services", href: "/service" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  return (
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
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <MobileNav navLinks={navLinks} />
      </nav>
    </header>
  );
}
