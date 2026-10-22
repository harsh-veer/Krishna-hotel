import type { Metadata } from "next";
import { Building2, Briefcase, Cake, Users, Gem, Heart, ClipboardList, PhoneCall, CalendarCheck } from "lucide-react";
import {
    CtaBand,
    FaqList,
    Highlight,
    JsonLd,
    LandingHero,
    SectionHeading,
    breadcrumbJsonLd,
    faqJsonLd,
    type Faq,
} from "@/components/landing/LandingSections";
import EventBookingForm from "@/components/EventBookingForm";
import { HOTEL_NAME, SITE_URL, WHATSAPP_NUMBER } from "@/lib/hotel";

const PATH = "/events";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Book Banquet Hall, Party & Meeting Hall | Krishna Hotel, Akbarpur";
const DESCRIPTION = "Send a booking request for the banquet hall, meeting hall, birthday party, kitty party, ring ceremony or engagement at Krishna Hotel, Akbarpur. We call you to confirm.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        type: "website",
        url: URL,
        title: TITLE,
        description: DESCRIPTION,
        images: [{ url: "/images/RUIDd266a089fa97483aa346a2e6a3a46fcb.jpg", alt: "Krishna Hotel banquet hall" }],
    },
};

const whatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi ${HOTEL_NAME}, I'd like to book the hall.\nEvent type:\nDate:\nApprox. guests:`
)}`;

const faqs: Faq[] = [
    {
        q: "Is my date confirmed as soon as I submit the form?",
        a: "No. The form sends us a request. The date is confirmed only after we call you, and you will get a confirmation email once it is confirmed.",
    },
    {
        q: "What events can I book?",
        a: "Banquet hall functions, meeting hall bookings, birthday parties, kitty parties, ring ceremonies and engagements.",
    },
    {
        q: "What are the charges and capacity?",
        a: "They depend on the event, the time slot and the seating you need. We share them on the call after your request.",
    },
    {
        q: "Can my guests stay at the hotel?",
        a: "Yes. Rooms are in the same building. Call us to check availability for your dates.",
    },
];

const crumbs = [
    { name: "Home", path: "/" },
    { name: "Book an Event", path: PATH },
];

const types = [
    { icon: Building2, name: "Banquet hall" },
    { icon: Briefcase, name: "Meeting hall" },
    { icon: Cake, name: "Birthday party" },
    { icon: Users, name: "Kitty party" },
    { icon: Gem, name: "Ring ceremony" },
    { icon: Heart, name: "Engagement" },
];

const steps = [
    { icon: ClipboardList, title: "Send your request", text: "Choose the event, date and time slot, and verify your email." },
    { icon: PhoneCall, title: "We call you", text: "We confirm availability, capacity and charges on the phone." },
    { icon: CalendarCheck, title: "Date confirmed", text: "You get a confirmation email once the hall is booked for you." },
];

export default function EventsPage() {
    return (
        <>
            <JsonLd data={breadcrumbJsonLd(crumbs)} />
            <JsonLd data={faqJsonLd(faqs)} />

            <LandingHero
                crumbs={crumbs}
                badge="Halls & Events"
                title={<>Book Your <Highlight>Event</Highlight> at Krishna Hotel</>}
                subline="Banquet hall, meeting hall, birthday and kitty parties, ring ceremonies and engagements. Send a request and we will call you to confirm."
                image="/images/RUIDd266a089fa97483aa346a2e6a3a46fcb.jpg"
                imageAlt="Krishna Hotel banquet hall"
                whatsappHref={whatsapp}
                bookLabel="Book Event"
                bookHref="#book-event"
            />

            <section className="bg-white py-14 sm:py-16">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {types.map(({ icon: Icon, name }) => (
                            <div key={name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-royal-blue/10 text-royal-blue">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <span className="font-semibold text-gray-900">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="book-event" className="scroll-mt-24 bg-gray-50 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="Booking request" title="Tell us about your event" />
                    <EventBookingForm />
                </div>
            </section>

            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading eyebrow="How it works" title="Three simple steps" />
                    <div className="grid gap-6 sm:grid-cols-3">
                        {steps.map(({ icon: Icon, title, text }, i) => (
                            <div key={title} className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 text-royal-blue">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <p className="mt-4 font-heading text-lg font-bold text-gray-900">{i + 1}. {title}</p>
                                <p className="mt-1 text-gray-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FaqList faqs={faqs} title="Event booking FAQs" />

            <CtaBand
                current={PATH}
                title="Prefer to talk?"
                text="Call or WhatsApp us with your event date and approximate guest count."
                whatsappHref={whatsapp}
                bookLabel="Book Event"
                bookHref="#book-event"
            />
        </>
    );
}
