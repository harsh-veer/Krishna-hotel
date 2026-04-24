import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import MobileBookingBar from "@/components/MobileBookingBar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishna Hotel | Affordable Luxury Stay on Ayodhya Highway",
  description: "Comfortable & Affordable Stay in Ambedkar Nagar. AC Rooms, Free Breakfast, Family Friendly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Krishna Hotel",
    description: "Comfortable & Affordable Stay in Ambedkar Nagar. AC Rooms, Free Breakfast, Family Friendly.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ayodhya Road, Near Fire Station",
      addressLocality: "Ambedkar Nagar",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN"
    },
    starRating: {
      "@type": "Rating",
      ratingValue: "3.8"
    },
    telephone: "+918604680149",
    image: "https://krishnahotel.com/images/pexels-jplenio-1435075.jpg",
    priceRange: "₹1200 - ₹2500"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <MobileBookingBar />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
