"use client";

import { ZOMATO_URL } from "@/lib/hotel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

export default function Hero() {
    const { t, lang } = useLang();
    return (
        <section className="relative h-[90vh] min-h-[600px] w-full bg-gray-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65"
                style={{ backgroundImage: 'url("/images/hero-room-banner.jpg")' }}
            ></div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* In Hindi the Ram Nagari greeting below already welcomes the guest, so skip this one. */}
                        {lang !== "hi" && (
                            <span className="mb-4 inline-block rounded-full bg-gold/90 px-3 py-1 text-sm font-semibold tracking-wider text-gray-900 uppercase backdrop-blur-md mr-2">
                                Welcome to Krishna Hotel
                            </span>
                        )}
                        <span className="mb-4 inline-block rounded-full bg-gold/90 px-3 py-1 text-sm font-semibold tracking-wider text-gray-900 uppercase backdrop-blur-md">
                            प्रभु श्री राम की नगरी में आपका हार्दिक स्वागत एवं अभिनंदन!
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="mb-6 font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
                    >
                        {t("Comfortable & Affordable Stay in ", "आरामदायक और किफ़ायती ठहराव ")}<span className="text-gold border-b-4 border-gold leading-tight">{t("Ambedkar Nagar", "अम्बेडकर नगर में")}</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl"
                    >
                        {t(
                            "Experience premium hospitality on the Ayodhya highway. Perfect for families, pilgrims, and business travelers looking for clean and budget-friendly AC rooms.",
                            "अयोध्या हाईवे पर साफ़-सुथरे, किफ़ायती एसी कमरे। परिवारों, श्रद्धालुओं और यात्रियों के लिए।"
                        )}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                    >
                        <a
                            href="tel:+918604680149"
                            className="inline-flex items-center justify-center rounded-md bg-royal-blue px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-royal-blue-light transition-all duration-200"
                        >
                            {t("Call Now to Book", "बुकिंग के लिए कॉल करें")}
                        </a>
                        <a
                            href="https://wa.me/918604680149"
                            className="inline-flex items-center justify-center rounded-md bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#20BE5A] transition-all duration-200"
                        >
                            {t("WhatsApp Booking", "व्हाट्सऐप से बुकिंग")}
                        </a>
                        <a
                            href={ZOMATO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-[#E23744] px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#c92a37] transition-all duration-200"
                        >
                            {t("Order on Zomato", "ज़ोमैटो पर ऑर्डर करें")}
                        </a>
                        <Link
                            href="#location"
                            className="inline-flex items-center justify-center rounded-md bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all duration-200 border border-white/20"
                        >
                            {t("Get Directions", "रास्ता देखें")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
