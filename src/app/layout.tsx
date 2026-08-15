import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import MobileBookingBar from "@/components/MobileBookingBar";
import AIChatbot from "@/components/AIChatbot";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://krishnaahotel.in"),

  title: "Krishna Hotel | Comfortable & Affordable Stay in Ambedkar Nagar",

  description:
    "Krishna Hotel offers comfortable and affordable AC rooms, free breakfast and family-friendly accommodation on the Ayodhya-Akbarpur Road in Ambedkar Nagar.",

  alternates: {
    canonical: "https://krishnaahotel.in/",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/logo-icon.png",
    apple: "/apple-touch-icon.png",
  },
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
    priceRange: "₹999 - ₹1500"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
        <AIChatbot />
        <Toaster position="bottom-right" />
        <Analytics />
      </body>
    </html>
  );
}
