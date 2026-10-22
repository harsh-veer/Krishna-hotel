import type { Metadata } from "next";
import { PartyPopper, Heart, Cake, Users, Sparkles, BedDouble, Utensils, Car, Phone } from "lucide-react";
import {
    CtaBand,
    DirectionsButton,
    FaqList,
    Highlight,
    InfoSplit,
    JsonLd,
    LandingHero,
    PhotoStrip,
    QuickFacts,
    RoomCards,
    breadcrumbJsonLd,
    faqJsonLd,
    type Faq,
} from "@/components/landing/LandingSections";
import { HOTEL_NAME, PHONE, SITE_URL, WHATSAPP_NUMBER } from "@/lib/hotel";

const PATH = "/banquet-hall-ambedkar-nagar";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Banquet Hall in Ambedkar Nagar | Krishna Hotel, Akbarpur";
const DESCRIPTION = "Banquet hall with a decorated stage for weddings, receptions, birthdays and family functions on the Ayodhya–Akbarpur Road. Rooms for guests, free parking.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        type: "website",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        images: [{ url: "/images/gallery-banquet-hall-full.jpg", alt: "Krishna Hotel banquet hall" }],
    },
};

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi ${HOTEL_NAME}, I'd like to enquire about the banquet hall.\nEvent type:\nDate:\nApprox. guests:`
)}`;

const faqs: Faq[] = [
    {
        q: "How many guests can the banquet hall hold, and what does it cost?",
        a: "Capacity and packages depend on your event and seating layout. Call or WhatsApp us for capacity and packages for your date.",
    },
    {
        q: "What kind of events can I hold here?",
        a: "Weddings, receptions, engagements, birthdays and other family functions, with a stage that can be decorated for the occasion.",
    },
    {
        q: "Can my guests stay at the hotel?",
        a: "Yes. Non-Ac Deluxe, Standard Ac and Super-Deluxe rooms are in the same building. Call us to check availability for your dates.",
    },
    {
        q: "Is there parking for guests?",
        a: "Yes, free parking for cars and bikes on the premises, with CCTV security.",
    },
    {
        q: "Is food available for the event?",
        a: "Our in-house Krishna Restaurant is pure vegetarian. Call or WhatsApp us to discuss food for your function.",
    },
];

const crumbs = [
    { name: "Home", path: "/" },
    { name: "Banquet Hall, Ambedkar Nagar", path: PATH },
];

const eventVenueJsonLd = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: `${HOTEL_NAME} Banquet Hall`,
    url: URL,
    telephone: PHONE,
    image: [
        `${SITE_URL}/images/gallery-banquet-hall-full.jpg`,
        `${SITE_URL}/images/gallery-banquet-event-seating.jpg`,
        `${SITE_URL}/images/gallery-night-front.jpg`,
    ],
    address: {
        "@type": "PostalAddress",
        streetAddress: "Ayodhya-Akbarpur Road, Near Fire Station",
        addressLocality: "Ambedkar Nagar",
        addressRegion: "Uttar Pradesh",
        postalCode: "224122",
        addressCountry: "IN",
    },
    containedInPlace: { "@type": "Hotel", name: HOTEL_NAME, url: SITE_URL },
    amenityFeature: ["Stage", "Free parking", "Guest rooms on site", "Pure vegetarian restaurant"].map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
    })),
};

export default function BanquetHallPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={faqJsonLd(faqs)} />
            <JsonLd data={eventVenueJsonLd} />

            <LandingHero
                crumbs={crumbs}
                badge="Akbarpur, Ambedkar Nagar"
                title={<>Banquet Hall in <Highlight>Ambedkar Nagar</Highlight></>}
                subline="A decorated stage for weddings, receptions and birthdays, with guest rooms, a pure-veg restaurant and free parking in the same building."
                image="/images/RUIDd266a089fa97483aa346a2e6a3a46fcb.jpg"
                imageAlt="Krishna Hotel banquet hall with guest seating and a decorated stage"
                whatsappHref={whatsapp}
                whatsappLabel="WhatsApp"
                bookLabel="Book Online"
                bookHref="/events"
            />

            <QuickFacts
                facts={[
                    { icon: <Sparkles className="h-6 w-6" />, title: "Decorated stage", text: "for your occasion" },
                    { icon: <BedDouble className="h-6 w-6" />, title: "Guest rooms", text: "in the same building" },
                    { icon: <Utensils className="h-6 w-6" />, title: "Pure veg", text: "Krishna Restaurant" },
                    { icon: <Car className="h-6 w-6" />, title: "Free parking", text: "cars & bikes" },
                ]}
            />

            <PhotoStrip
                eyebrow="Photos"
                title="Inside the banquet hall"
                tone="white"
                photos={[
                    { src: "/images/RUID5bcf51637f024bd390fb78b2fb6a1e27.jpg", alt: "Stage decorated with flowers, drapes and lights", caption: "Stage decor" },
                    { src: "/images/gallery-banquet-hall-full.jpg", alt: "Full view of the banquet hall with balloons and seating", caption: "The hall" },
                    { src: "/images/gallery-banquet-event-seating.jpg", alt: "Guest seating arranged for an event", caption: "Guest seating" },
                    { src: "/images/RUIDa75dbcd0d1b74354a6f837958bbd00dc.jpg", alt: "Rows of guest chairs facing the decorated stage", caption: "Ready for your function" },
                ]}
            />

            <InfoSplit
                tone="tinted"
                eyebrow="Events we host"
                title="One venue for the whole function"
                text="Hall, guest rooms and restaurant in one building on the main road: simple for you, easy to find for your guests."
                photo={{ src: "/images/RUIDaef4c68052bf42948a7c1d26a326863e.jpg", alt: "Stage with couple's couch and balloon decoration" }}
                points={[
                    { icon: <Heart className="h-5 w-5" />, title: "Weddings & receptions", text: "Stage for the couple" },
                    { icon: <PartyPopper className="h-5 w-5" />, title: "Engagements", text: "Family rituals & get-togethers" },
                    { icon: <Cake className="h-5 w-5" />, title: "Birthdays", text: "Stage decor & balloon arches" },
                    { icon: <Users className="h-5 w-5" />, title: "Family events", text: "Hall seating for your guests" },
                ]}
            >
                <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
                    <p className="flex items-center gap-2 font-heading text-lg font-bold text-gray-900">
                        <Phone className="h-5 w-5 text-royal-blue" aria-hidden="true" />
                        Capacity &amp; packages
                    </p>
                    <p className="mt-1 text-gray-700">Call or WhatsApp for capacity and packages. Tell us your event type, date and approximate guest count.</p>
                </div>
                <div className="mt-6"><DirectionsButton /></div>
            </InfoSplit>

            <RoomCards
                eyebrow="Rooms for your guests"
                title="Out-of-town relatives can stay on site"
                intro="Prices are per room, per night."
            />

            <FaqList faqs={faqs} title="Banquet hall FAQs" />

            <CtaBand
                current={PATH}
                title="Planning a function?"
                text="Call or WhatsApp with your event date and approximate guest count to check availability, capacity and packages."
                whatsappHref={whatsapp}
                whatsappLabel="WhatsApp"
                bookLabel="Book Online"
                bookHref="/events"
            />
        </>
    );
}
