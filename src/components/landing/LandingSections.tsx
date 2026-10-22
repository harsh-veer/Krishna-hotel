// Server-rendered building blocks for the local-SEO landing pages
// (/hotel-near-ayodhya, /hotel-in-akbarpur, /banquet-hall-ambedkar-nagar).
// Visual language follows the home page (Hero.tsx, Rooms.tsx, Features.tsx): full-bleed photo hero,
// gold badge, royal-blue / gold accents, big photos, short copy.
// English-only on purpose: these pages are not wired into the client-side Hindi switch.
// Heads-up: many public/images file names do not match what the photo shows
// (e.g. gallery-suite-seating.jpg is the hotel front at night, gallery-ac-room-view.jpg the daytime front,
// gallery-night-front.jpg a banquet stage). The pages pick files by what the photo actually shows.
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Phone, CalendarCheck, MapPin, Users, BedDouble, Bath, ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ROOMS_DATA } from "@/lib/rooms";
import { HOTEL_NAME, PHONE, SITE_URL } from "@/lib/hotel";

export type Faq = { q: string; a: string };
export type Crumb = { name: string; path: string };
export type Photo = { src: string; alt: string; caption?: string; position?: string };
export type Fact = { icon: React.ReactNode; title: string; text: string };

// "+918604680149" -> "+91 86046 80149"
export const PHONE_DISPLAY = `${PHONE.slice(0, 3)} ${PHONE.slice(3, 8)} ${PHONE.slice(8)}`;
export const MAPS_URL = "https://www.google.com/maps/search/Krishna+Hotel+Akbarpur+Ambedkar+Nagar/";
export const ADDRESS = "Ayodhya–Akbarpur Road, Near Fire Station, Ambedkar Nagar (Akbarpur), Uttar Pradesh 224122";

export const ROOM_SLUGS = ["non-ac-deluxe", "standard-ac-room", "super-deluxe-room"] as const;

export function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${SITE_URL}${c.path}`,
        })),
    };
}

export function faqJsonLd(faqs: Faq[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}

/* ---------- Buttons ---------- */

const btn = "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-base font-semibold shadow-sm transition-all duration-200";

export function CtaButtons({ whatsappHref, whatsappLabel = "WhatsApp", bookLabel = "Book Now", bookHref = "/#contact", showNumber = false, onBlue = false }: {
    whatsappHref: string;
    whatsappLabel?: string;
    bookLabel?: string;
    bookHref?: string;
    showNumber?: boolean;
    /** On the royal-blue band the call button turns white so it stays visible. */
    onBlue?: boolean;
}) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Link href={bookHref} className={`${btn} col-span-2 bg-gold text-gray-900 hover:bg-gold-light sm:px-8`}>
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                {bookLabel}
            </Link>
            <a href={`tel:${PHONE}`} className={`${btn} sm:px-8 ${onBlue ? "bg-white text-royal-blue hover:bg-gray-100" : "bg-royal-blue text-white hover:bg-royal-blue-light"}`}>
                <Phone className="h-5 w-5" aria-hidden="true" />
                {showNumber ? <><span className="sm:hidden">Call</span><span className="hidden sm:inline">Call {PHONE_DISPLAY}</span></> : "Call Now"}
            </a>
            <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${btn} bg-[#25D366] text-white hover:bg-[#20BE5A] sm:px-8`}
            >
                <WhatsAppIcon />
                {whatsappLabel}
            </a>
        </div>
    );
}

/* ---------- Hero ---------- */

export function LandingHero({ badge, title, subline, image, imageAlt, imagePosition = "center", crumbs, whatsappHref, whatsappLabel, bookLabel, bookHref }: {
    badge: string;
    title: React.ReactNode;
    subline: string;
    image: string;
    imageAlt: string;
    imagePosition?: string;
    crumbs: Crumb[];
    whatsappHref: string;
    whatsappLabel?: string;
    bookLabel?: string;
    bookHref?: string;
}) {
    return (
        <section className="relative isolate flex min-h-[72vh] w-full items-center overflow-hidden bg-gray-900 lg:min-h-[82vh]">
            <Image
                src={image}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
                className="-z-10 object-cover opacity-70"
                style={{ objectPosition: imagePosition }}
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/50 to-gray-900/20" aria-hidden="true" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900/70 via-gray-900/20 to-transparent" aria-hidden="true" />

            <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 sm:pb-28 lg:px-8">
                <nav aria-label="Breadcrumb" className="mb-6">
                    <ol className="flex flex-wrap items-center gap-1 text-xs text-white/70">
                        {crumbs.map((c, i) => (
                            <li key={c.path} className="flex items-center gap-1">
                                {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
                                {i < crumbs.length - 1 ? (
                                    <Link href={c.path} className="hover:text-white">{c.name}</Link>
                                ) : (
                                    <span aria-current="page">{c.name}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
                <div className="max-w-3xl">
                    <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-900 backdrop-blur-md sm:text-sm">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {badge}
                    </span>
                    <h1 className="mb-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
                        {title}
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">{subline}</p>
                    <CtaButtons whatsappHref={whatsappHref} whatsappLabel={whatsappLabel} bookLabel={bookLabel} bookHref={bookHref} />
                </div>
            </div>
        </section>
    );
}

/** Gold underlined highlight used inside the H1, same as the home hero. */
export function Highlight({ children }: { children: React.ReactNode }) {
    return <span className="border-b-4 border-gold text-gold">{children}</span>;
}

/* ---------- Quick facts (overlaps the bottom of the hero) ---------- */

export function QuickFacts({ facts }: { facts: Fact[] }) {
    return (
        <section aria-label="Quick facts" className="relative z-10 -mt-14 px-4 sm:-mt-16 sm:px-6 lg:px-8">
            <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {facts.map((f) => (
                    <li key={f.title} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg sm:gap-4 sm:p-5">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-blue/10 text-royal-blue sm:h-12 sm:w-12 sm:rounded-2xl [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                            {f.icon}
                        </span>
                        <span>
                            <span className="block font-heading text-[15px] font-bold leading-tight text-gray-900 sm:text-lg">{f.title}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-gray-500 sm:text-sm">{f.text}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/* ---------- Section heading (centered, like the home page) ---------- */

export function SectionHeading({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: React.ReactNode }) {
    return (
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
            {eyebrow && (
                <span className="mb-4 inline-block rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-900 shadow-sm">
                    {eyebrow}
                </span>
            )}
            <h2 className="font-heading text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
            {intro && <p className="mt-4 text-lg text-gray-600">{intro}</p>}
        </div>
    );
}

/* ---------- Rooms (same card style as Rooms.tsx, data from ROOMS_DATA) ---------- */

export function RoomCards({ eyebrow, title, intro, note }: { eyebrow?: string; title: string; intro?: string; note?: string }) {
    return (
        <section className="bg-white pb-20 pt-20 sm:pt-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {ROOM_SLUGS.map((slug) => {
                        const room = ROOMS_DATA[slug];
                        return (
                            <article key={slug} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={room.image}
                                        alt={`${room.name} at ${HOTEL_NAME}`}
                                        fill
                                        sizes="(min-width: 768px) 33vw, 100vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-royal-blue shadow-md">
                                        {room.price} <span className="text-xs font-medium text-gray-500">/ night</span>
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="mb-3 font-heading text-xl font-bold text-gray-900">{room.name}</h3>
                                    <div className="mb-6 flex flex-1 flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-gray-400" aria-hidden="true" />{room.bedType}</span>
                                        <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-gray-400" aria-hidden="true" />{room.maxGuests}</span>
                                        <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-gray-400" aria-hidden="true" />{room.bathType}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/rooms/${slug}`}
                                            className="flex-1 rounded-lg border border-royal-blue px-4 py-3 text-center text-sm font-semibold text-royal-blue transition-colors duration-200 hover:bg-royal-blue hover:text-white"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href="/#contact"
                                            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-semibold text-gray-900 transition-colors duration-200 hover:border-royal-blue hover:bg-royal-blue hover:text-white"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
                {note && <p className="mt-8 text-center text-sm text-gray-500">{note}</p>}
            </div>
        </section>
    );
}

/* ---------- Photo strip: one big photo + three supporting ones ---------- */

export function PhotoStrip({ eyebrow, title, photos, tone = "tinted" }: { eyebrow?: string; title: string; photos: [Photo, Photo, Photo, Photo]; tone?: "tinted" | "white" }) {
    const cell = [
        "col-span-2 h-72 sm:h-96 lg:row-span-2 lg:h-auto",
        "h-44 sm:h-60",
        "h-44 sm:h-60",
        "col-span-2 h-56 sm:h-60",
    ];
    return (
        <section className={`pb-6 pt-20 sm:pb-8 sm:pt-24 ${tone === "tinted" ? "bg-gradient-to-b from-royal-blue/5 to-white" : "bg-white"}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow={eyebrow} title={title} />
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[15rem_15rem]">
                    {photos.map((p, i) => (
                        <figure key={p.src} className={`group relative overflow-hidden rounded-2xl shadow-md ${cell[i]}`}>
                            <Image
                                src={p.src}
                                alt={p.alt}
                                fill
                                sizes={i === 0 || i === 3 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                style={p.position ? { objectPosition: p.position } : undefined}
                            />
                            {p.caption && (
                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 to-transparent px-4 pb-3 pt-10 text-sm font-semibold text-white">
                                    {p.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- Photo + short text block (getting here / why stay) ---------- */

export function InfoSplit({ eyebrow, title, text, points, photo, children, tone = "white" }: {
    tone?: "tinted" | "white";
    eyebrow: string;
    title: string;
    text: string;
    points: Fact[];
    photo: Photo;
    children?: React.ReactNode;
}) {
    return (
        <section className={`py-20 sm:py-24 ${tone === "tinted" ? "bg-gradient-to-b from-royal-blue/5 to-white" : "bg-white"}`}>
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
                <div className="relative h-80 overflow-hidden rounded-3xl shadow-2xl sm:h-[28rem] lg:h-[34rem]">
                    <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                        style={photo.position ? { objectPosition: photo.position } : undefined}
                    />
                    <div className="absolute inset-x-6 bottom-6 hidden items-start gap-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md sm:flex">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-royal-blue" aria-hidden="true" />
                        <p className="text-sm text-gray-700"><span className="font-semibold text-gray-900">{HOTEL_NAME}</span>, {ADDRESS}</p>
                    </div>
                </div>
                <div>
                    <span className="mb-4 inline-block rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-900 shadow-sm">
                        {eyebrow}
                    </span>
                    <h2 className="mb-5 font-heading text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h2>
                    <p className="mb-8 text-lg leading-relaxed text-gray-600">{text}</p>
                    <ul className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {points.map((p) => (
                            <li key={p.title} className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-blue/10 text-royal-blue">{p.icon}</span>
                                <span>
                                    <span className="block font-heading font-bold text-gray-900">{p.title}</span>
                                    <span className="block text-sm text-gray-600">{p.text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <p className="mb-6 flex items-start gap-2 text-sm text-gray-600 sm:hidden">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal-blue" aria-hidden="true" />
                        <span><span className="font-semibold text-gray-900">{HOTEL_NAME}</span>, {ADDRESS}</span>
                    </p>
                    {children ?? <DirectionsButton />}
                </div>
            </div>
        </section>
    );
}

export function DirectionsButton() {
    return (
        <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-royal-blue px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-royal-blue-light sm:w-auto"
        >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            Get Directions <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
    );
}

/* ---------- FAQ: native <details> keeps every answer in the server HTML (matches FAQPage JSON-LD) ---------- */

export function FaqList({ faqs, title = "Frequently Asked Questions" }: { faqs: Faq[]; title?: string }) {
    return (
        <section className="bg-gray-50 py-20 sm:py-24">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <SectionHeading eyebrow="FAQ" title={title} />
                <div className="space-y-4">
                    {faqs.map((f, i) => (
                        <details
                            key={f.q}
                            open={i === 0}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm open:border-royal-blue"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 [&::-webkit-details-marker]:hidden">
                                <span className="font-heading text-base font-semibold text-gray-900 sm:text-lg">{f.q}</span>
                                <span className="shrink-0 rounded-full bg-gray-100 p-1 text-gray-500 transition-transform group-open:rotate-180 group-open:bg-royal-blue group-open:text-white">
                                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                                </span>
                            </summary>
                            <p className="px-5 pb-5 leading-relaxed text-gray-600 sm:px-6">{f.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- Final call-to-action band ---------- */

export function CtaBand({ title, text, whatsappHref, whatsappLabel, bookLabel, bookHref, current }: {
    title: string;
    text: string;
    whatsappHref: string;
    whatsappLabel?: string;
    bookLabel?: string;
    bookHref?: string;
    current: string;
}) {
    const links = [
        { href: "/hotel-near-ayodhya", label: "Hotel near Ayodhya" },
        { href: "/hotel-in-akbarpur", label: "Hotel in Akbarpur" },
        { href: "/banquet-hall-ambedkar-nagar", label: "Banquet hall" },
        { href: "/events", label: "Book an event" },
    ].filter((l) => l.href !== current);
    return (
        <section className="relative overflow-hidden bg-royal-blue py-20 sm:py-24">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-royal-blue-light/40 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
                <h2 className="font-heading text-3xl font-bold text-white sm:text-5xl">{title}</h2>
                <p className="mb-10 mt-4 text-lg text-blue-100">{text}</p>
                <CtaButtons whatsappHref={whatsappHref} whatsappLabel={whatsappLabel} bookLabel={bookLabel} bookHref={bookHref} showNumber onBlue />
                <p className="mt-12 text-sm text-blue-200">
                    Also see:{" "}
                    {links.map((l, i) => (
                        <span key={l.href}>
                            {i > 0 && " · "}
                            <Link href={l.href} className="underline decoration-blue-300/50 underline-offset-4 hover:text-white">{l.label}</Link>
                        </span>
                    ))}
                    {" · "}
                    <Link href="/" className="underline decoration-blue-300/50 underline-offset-4 hover:text-white">Home</Link>
                </p>
            </div>
        </section>
    );
}
