import Link from "next/link";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import Image from "next/image";

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
  {
    name: "Instagram",
    href: "https://www.instagram.com/gotechnician.in/",
    icon: Instagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/Official.GoTechnician",
    icon: Facebook,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/gotechnician/",
    icon: Linkedin,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-4 py-12 md:mx-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo & Social */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={"/go-technicians.jpeg"}
                alt="Logo"
                width={90}
                height={50}
              />
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
                    className="rounded-md border border-blue-600 p-2 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
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
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600"
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
                    className="text-sm text-slate-600 transition-colors hover:text-blue-600"
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
                Mumbai/Navi Mumbai, Maharashtra
                {/* <br />
                400076 */}
              </p>
              <p>
                <a
                  href="mailto:gotechnicians.com@gmail.com"
                  className="transition-colors hover:text-blue-600"
                >
                  gotechnicians.com@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+917977661546"
                  className="transition-colors hover:text-blue-600"
                >
                  +91 79776 61546
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
            <Image
              src={"/go-technicians.jpeg"}
              alt="Logo"
              width={90}
              height={50}
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
