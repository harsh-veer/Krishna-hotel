import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROOMS_DATA } from "@/lib/rooms";
import { HOTEL_NAME, SITE_URL } from "@/lib/hotel";
import { languageAlternates } from "@/lib/i18n/seo";
import RoomDetail from "./RoomDetail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(ROOMS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS_DATA[slug];
  if (!room) return {};

  const url = `${SITE_URL}/rooms/${slug}`;
  const title = `${room.name} at ${room.price}/night | ${HOTEL_NAME} Ambedkar Nagar`;
  const description = `${room.name} at ${HOTEL_NAME}, Ayodhya-Akbarpur Road, Ambedkar Nagar: ${room.bedType}, ${room.maxGuests}, ${room.bathType}. ${room.price} per night including taxes. Free parking and Wi-Fi.`;

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/rooms/${slug}`) },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: room.image, alt: room.name }],
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!ROOMS_DATA[slug]) notFound();
  return <RoomDetail slug={slug} />;
}
