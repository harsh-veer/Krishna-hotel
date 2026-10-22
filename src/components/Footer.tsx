"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function Footer() {
    const { t, href } = useLang();
    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo-transparent.png"
                                alt={t("Krishna Hotel Logo", "कृष्णा होटल लोगो")}
                                width={44}
                                height={44}
                                className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg"
                            />
                            <h3 className="text-xl font-bold font-heading text-gold">{t("Krishna Hotel", "कृष्णा होटल")}</h3>
                        </div>
                        <p className="text-gray-300 mb-4">
                            {t(
                                "Affordable luxury stay on the Ayodhya Highway. Comfort, cleanliness, and budget-friendly pricing for families and travelers.",
                                "अयोध्या हाईवे पर किफ़ायती और आरामदायक ठहराव। परिवारों और यात्रियों के लिए आराम, साफ़-सफ़ाई और कम दाम।"
                            )}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading mb-4">{t("Quick Links", "ज़रूरी लिंक")}</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href={href("/#rooms")} className="hover:text-gold transition">{t("Rooms", "कमरे")}</a></li>
                            <li><a href={href("/#amenities")} className="hover:text-gold transition">{t("Amenities", "सुविधाएँ")}</a></li>
                            <li><a href={href("/#gallery")} className="hover:text-gold transition">{t("Gallery", "गैलरी")}</a></li>
                            <li><a href={href("/#reviews")} className="hover:text-gold transition">{t("Reviews", "रिव्यू")}</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading mb-4">{t("Contact Us", "संपर्क करें")}</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>📍 {t("Ayodhya-Akbarpur Route,Near Fire Station Ambedkar Nagar 224122", "अयोध्या-अकबरपुर मार्ग, फ़ायर स्टेशन के पास, अम्बेडकर नगर 224122")}</li>
                            <li>📞 <a href="tel:+918604680149" className="hover:text-gold transition">+91 86046 80149</a></li>
                            <li>💬 <a href="https://wa.me/918604680149" className="hover:text-gold transition">{t("WhatsApp Us", "व्हाट्सऐप करें")}</a></li>
                        </ul>
                    </div>
                </div>
                <nav aria-label={t("Popular searches", "लोकप्रिय खोजें")} className="mt-8 border-t border-gray-800 pt-6 text-sm text-gray-400">
                    <span className="mr-2 font-semibold text-gray-300">{t("Popular searches:", "लोकप्रिय खोजें:")}</span>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 sm:mt-0 sm:inline-flex">
                        <li><a href="/hotel-near-ayodhya" className="hover:text-gold transition">{t("Hotel near Ayodhya Ram Mandir", "अयोध्या राम मंदिर के पास होटल")}</a></li>
                        <li><a href="/hotel-in-akbarpur" className="hover:text-gold transition">{t("Hotel in Akbarpur", "अकबरपुर में होटल")}</a></li>
                        <li><a href="/banquet-hall-ambedkar-nagar" className="hover:text-gold transition">{t("Banquet hall in Ambedkar Nagar", "अम्बेडकर नगर में बैंक्वेट हॉल")}</a></li>
                        <li><a href="/events" className="hover:text-gold transition">{t("Book banquet hall & events", "बैंक्वेट हॉल और इवेंट बुक करें")}</a></li>
                    </ul>
                </nav>
                <div className="mt-6 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {t("Krishna Hotel. All rights reserved.", "कृष्णा होटल। सर्वाधिकार सुरक्षित।")}</p>
                </div>
            </div>
        </footer>
    );
}
