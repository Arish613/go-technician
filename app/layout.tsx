import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Go Technicians | Trusted Home & Office Services",
    template: "%s | Go Technicians",
  },
  description:
    "Book verified technicians for AC repair, laptop service, appliance repair, home cleaning, plumbing & more. Same-day service, transparent pricing, and 30-day warranty across 30+ cities in India.",
  keywords: [
    "home services",
    "AC repair",
    "laptop service",
    "appliance repair",
    "home cleaning",
    "plumbing",
    "electrician",
    "technician",
    "Mumbai",
    "Delhi",
    "Bangalore",
  ],
  authors: [{ name: "Go Technicians" }],
  creator: "Go Technicians",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gotechnicians.in",
    siteName: "Go Technicians",
    title: "Go Technicians | Trusted Home & Office Services",
    description:
      "Book verified technicians for AC repair, laptop service, appliance repair, home cleaning, plumbing & more. Same-day service across 30+ cities.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Go Technicians - Trusted Home Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Go Technicians | Trusted Home & Office Services",
    description:
      "Book verified technicians for AC repair, laptop service, appliance repair, home cleaning, plumbing & more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
