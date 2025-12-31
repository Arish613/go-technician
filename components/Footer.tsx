import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  //   { name: "My Bookings", href: "/bookings" },
  { name: "Blogs", href: "/blog" },
  //   { name: "Contact Us", href: "/contact" },
  { name: "Raise a Complaint", href: "/raise-a-complaint" },
];

const legalLinks = [
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/privacy" },
  //   { name: "Return Policy", href: "/return-policy" },
  //   { name: "Refund Policy", href: "/refund-policy" },
  { name: "Disclaimer", href: "/disclaimer" },
  //   { name: "Profile", href: "/profile" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-4 py-12 md:mx-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Social */}
          <div>
            <Link href="/" className="flex items-center gap-2">
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
                GO
                <br />
                TECHNICIANS
              </span>
            </Link>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-purple-600 p-2 text-purple-600 transition-colors hover:bg-purple-600 hover:text-white"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Navigation links
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-purple-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Legal pages
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-purple-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Contact us
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                Shop no. 101, Powai Plaza, Powai, Mumbai
                <br />
                400076
              </p>
              <p>
                <a
                  href="mailto:contact@gotechnicians.in"
                  className="transition-colors hover:text-purple-600"
                >
                  contact@gotechnicians.in
                </a>
              </p>
              <p>
                <a
                  href="tel:+917098110110"
                  className="transition-colors hover:text-purple-600"
                >
                  +91 7098110110
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-200">
        <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:mx-20">
          <p className="text-sm text-slate-600">All Rights Reserved ©</p>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 w-6">
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
            <span className="text-sm font-bold text-slate-900">
              GO TECHNICIANS
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
