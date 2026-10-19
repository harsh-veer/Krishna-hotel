import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import OfferBanner from "@/components/OfferBanner";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import MobileBookingBar from "@/components/MobileBookingBar";
import AIChatbot from "@/components/AIChatbot";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, HOTEL_NAME, PHONE, SITE_URL } from "@/lib/hotel";

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
  metadataBase: new URL(SITE_URL),

  title: "Krishna Hotel | Comfortable & Affordable Stay in Ambedkar Nagar",

  description:
    "Krishna Hotel offers comfortable and affordable AC rooms, free breakfast and family-friendly accommodation on the Ayodhya-Akbarpur Road in Ambedkar Nagar.",

  openGraph: {
    type: "website",
    siteName: HOTEL_NAME,
    locale: "en_IN",
    title: "Krishna Hotel | Comfortable & Affordable Stay in Ambedkar Nagar",
    description:
      "AC rooms from ₹999, free breakfast and safe parking on the Ayodhya-Akbarpur Road in Ambedkar Nagar.",
    images: [{ url: "/images/gallery-daytime-front.jpg", alt: "Krishna Hotel front view" }],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-144.png", type: "image/png", sizes: "144x144" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/logo-icon.png", type: "image/png", sizes: "602x602" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
    name: HOTEL_NAME,
    url: SITE_URL,
    description: "Comfortable & Affordable Stay in Ambedkar Nagar. AC Rooms, Free Breakfast, Family Friendly.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ayodhya-Akbarpur Road, Near Fire Station",
      addressLocality: "Ambedkar Nagar",
      addressRegion: "Uttar Pradesh",
      postalCode: "224122",
      addressCountry: "IN"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: GOOGLE_RATING,
      reviewCount: GOOGLE_REVIEW_COUNT,
      bestRating: 5
    },
    telephone: PHONE,
    email: "krishnahotel10851@gmail.com",
    image: `${SITE_URL}/images/gallery-daytime-front.jpg`,
    priceRange: "₹999 - ₹1500",
    checkinTime: "12:00",
    checkoutTime: "11:00",
    amenityFeature: ["Free parking", "Free Wi-Fi", "Air conditioning", "Restaurant", "Banquet hall", "24-hour room service"].map(
      (name) => ({ "@type": "LocationFeatureSpecification", name, value: true })
    )
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
        <LanguageProvider>
          <OfferBanner />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingContact />
          <MobileBookingBar />
          <AIChatbot />
          <Toaster position="bottom-right" />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
