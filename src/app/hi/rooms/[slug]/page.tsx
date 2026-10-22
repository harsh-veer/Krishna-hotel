import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROOMS_DATA } from "@/lib/rooms";
import { ROOMS_HI } from "@/lib/i18n/rooms";
import { HOTEL_NAME } from "@/lib/hotel";
import { languageAlternates, pageUrls } from "@/lib/i18n/seo";
import RoomDetail from "@/app/rooms/[slug]/RoomDetail";

// Hindi room pages (/hi/rooms/[slug]): the same RoomDetail as /rooms/[slug], rendered in Hindi
// on the server because the LanguageProvider picks the language from the /hi URL.
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ROOMS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS_DATA[slug];
  const hi = ROOMS_HI[slug];
  if (!room || !hi) return {};

  const { hi: url } = pageUrls(`/rooms/${slug}`);
  const title = `${hi.name} ${room.price}/रात | कृष्णा होटल अंबेडकर नगर`;
  const description = `कृष्णा होटल (Krishna Hotel), अयोध्या-अकबरपुर रोड, अंबेडकर नगर में ${hi.name}: ${hi.bedType}, ${hi.maxGuests}, ${hi.bathType}। टैक्स सहित ${room.price} प्रति रात। मुफ़्त पार्किंग और वाई-फ़ाई।`;

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(`/rooms/${slug}`) },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: HOTEL_NAME,
      locale: "hi_IN",
      images: [{ url: room.image, alt: hi.name }],
    },
  };
}

export default async function HindiRoomDetailPage({ params }: Props) {
  const { slug } = await params;
  if (!ROOMS_DATA[slug]) notFound();
  return <RoomDetail slug={slug} />;
}
