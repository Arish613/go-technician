import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyContactButtons } from "@/components/contact/ContactButtons";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/context/CartContext";

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
  metadataBase: new URL("https://gotechnicians.com/"),
  title: {
    default: "Go Technicians | Trusted Home & Office Services",
    template: "%s | Go Technicians",
  },
  alternates: {
    canonical: "./",
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
    url: "https://gotechnicians.com",
    siteName: "Go Technicians",
    title: "Go Technicians | Trusted Home & Office Services",
    description:
      "Book verified technicians for AC repair, laptop service, appliance repair, home cleaning, plumbing & more. Same-day service across 30+ cities.",
    images: [
      {
        url: "/logo.png",
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
    images: ["/logo.png"],
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
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <GoogleAnalytics gaId="G-JQHYVKDNZM" />
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <StickyContactButtons />
        </CartProvider>
      </body>
    </html>
  );
}
