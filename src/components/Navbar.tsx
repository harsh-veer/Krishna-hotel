"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageSquare, Languages } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toEnglishPath, toHindiPath, useLang } from "@/lib/i18n";

// Pill that switches the site between English and Hindi; it names the language you switch to.
// `size` is "sm" in the mobile bar; the desktop pill drops its icon on tablet widths to fit the menu.
// Pages with a Hindi twin (/ <-> /hi, /rooms/x <-> /hi/rooms/x) switch by going to the other URL;
// other pages switch the text in place. Either way the choice is saved.
function LanguageToggle({ size = "md" }: { size?: "sm" | "md" }) {
    const { lang, setLang, toggleLang, hindiRoute } = useLang();
    const pathname = usePathname() ?? "/";
    const router = useRouter();

    const onToggle = () => {
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        if (hindiRoute) {
            setLang("en");
            router.push(toEnglishPath(pathname) + hash);
            return;
        }
        const hiPath = lang === "en" ? toHindiPath(pathname) : null;
        if (hiPath) {
            setLang("hi");
            router.push(hiPath + hash);
            return;
        }
        toggleLang();
    };

    return (
        <button
            type="button"
            onClick={onToggle}
            lang={lang === "en" ? "hi" : "en"}
            aria-label={lang === "en" ? "हिंदी में देखें (View in Hindi)" : "View in English (अंग्रेज़ी में देखें)"}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-royal-blue/30 bg-royal-blue/5 font-semibold text-royal-blue hover:bg-royal-blue hover:text-white transition-colors ${
                size === "sm" ? "px-2.5 py-1 text-xs" : "px-2.5 py-1 text-sm lg:px-3 lg:py-1.5"
            }`}
        >
            <Languages className={`h-4 w-4 ${size === "md" ? "hidden lg:block" : ""}`} aria-hidden="true" />
            <span>{lang === "en" ? "हिंदी" : "English"}</span>
        </button>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { t, href } = useLang();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href={href("/")} className="flex items-center gap-3 group">
                        <Image
                            src="/logo-transparent.png"
                            alt="Krishna Hotel Logo"
                            width={44}
                            height={44}
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                        <span className="text-2xl font-bold text-royal-blue tracking-tight">
                            {t("Krishna Hotel", "कृष्णा होटल")}
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
                    <Link href={href("/#rooms")} className="text-gray-700 hover:text-royal-blue font-medium transition-colors">{t("Rooms", "कमरे")}</Link>
                    <Link href={href("/#amenities")} className="text-gray-700 hover:text-royal-blue font-medium transition-colors">{t("Amenities", "सुविधाएँ")}</Link>
                    <Link href={href("/#gallery")} className="text-gray-700 hover:text-royal-blue font-medium transition-colors">{t("Gallery", "गैलरी")}</Link>
                    <Link href={href("/#location")} className="text-gray-700 hover:text-royal-blue font-medium transition-colors">{t("Location", "लोकेशन")}</Link>
                    <Link href="/events" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">{t("Events", "इवेंट")}</Link>
                    <Link
                        href={href("/#reviews")}
                        className="inline-flex items-center space-x-1.5 text-gray-700 hover:text-royal-blue font-medium transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>{t("Reviews", "रिव्यू")}</span>
                    </Link>

                    <LanguageToggle />

                    {/* Book Now Button */}
                    <Link href={href("/#contact")} className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors">
                        {t("Book Now", "अभी बुक करें")}
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center gap-3 md:hidden">
                    <LanguageToggle size="sm" />
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">{t("Open main menu", "मेन्यू खोलें")}</span>
                        {mobileOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-md">
                    <Link href={href("/#rooms")} onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">{t("Rooms", "कमरे")}</Link>
                    <Link href={href("/#amenities")} onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">{t("Amenities", "सुविधाएँ")}</Link>
                    <Link href={href("/#gallery")} onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">{t("Gallery", "गैलरी")}</Link>
                    <Link href={href("/#location")} onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">{t("Location", "लोकेशन")}</Link>
                    <Link href="/events" onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">{t("Events", "इवेंट")}</Link>
                    <Link href={href("/#reviews")} onClick={() => setMobileOpen(false)} className="flex items-center space-x-1.5 text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{t("Leave a Review", "रिव्यू लिखें")}</span>
                    </Link>

                    <Link href={href("/#contact")} onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-light transition-colors">
                        {t("Book Now", "अभी बुक करें")}
                    </Link>
                </div>
            )}
        </nav>
    );
}
