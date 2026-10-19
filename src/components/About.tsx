"use client";

import { CheckCircle2, Star, Coffee, Wifi, Car, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from "@/lib/hotel";
import { useLang } from "@/lib/i18n";

export default function About() {
    const { t } = useLang();
    const highlights = [
        { icon: <CheckCircle2 className="h-5 w-5 text-gold" />, text: t("Spacious AC Rooms", "बड़े एसी कमरे") },
        { icon: <Coffee className="h-5 w-5 text-gold" />, text: t("Breakfast", "नाश्ता") },
        { icon: <Car className="h-5 w-5 text-gold" />, text: t("Ample Free Parking", "बड़ी मुफ़्त पार्किंग") },
        { icon: <Shield className="h-5 w-5 text-gold" />, text: t("Family Friendly & Safe", "परिवार के लिए सुरक्षित") },
        { icon: <Wifi className="h-5 w-5 text-gold" />, text: t("High-Speed WiFi", "हाई-स्पीड वाई-फ़ाई") },
        { icon: <Star className="h-5 w-5 text-gold" />, text: t("24/7 Room Service", "24/7 रूम सर्विस") },
    ];

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">

                    {/* Images Grid */}
                    <motion.div 
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <Image
                            width={600}
                            height={512}
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            src="/images/RUID782b578fd9e64411aedb00e919509b29.jpg"
                            alt={t("Hotel Reception", "होटल रिसेप्शन")}
                            className="rounded-2xl shadow-lg object-cover h-64 w-full"
                        />
                        <Image
                            width={600}
                            height={512}
                            sizes="(min-width: 1024px) 25vw, 50vw"
                            src="/images/RUID4542dd11e494471dab89a44c7c8115a3.jpg"
                            alt={t("Hotel Room Detail", "होटल का कमरा")}
                            className="rounded-2xl shadow-lg object-cover h-64 w-full mt-8"
                        />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-yellow-800 mb-6">
                            <Star className="h-4 w-4 fill-gold text-gold" />
                            <span>{t(
                                `${GOOGLE_REVIEW_COUNT}+ Google Reviews (${GOOGLE_RATING.toFixed(1)} Rating)`,
                                `${GOOGLE_REVIEW_COUNT}+ गूगल रिव्यू (${GOOGLE_RATING.toFixed(1)} रेटिंग)`
                            )}</span>
                        </div>

                        <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl mb-6">
                            {t("Your Home Away From Home on Ayodhya Highway", "अयोध्या हाईवे पर घर जैसा ठहराव")}
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {t(
                                "Located perfectly on the Ayodhya-Akbarpur route, Krishna Hotel is the ideal stopover for pilgrims, highway travelers, and families. We pride ourselves on offering luxurious comfort without the premium price tag.",
                                "अयोध्या-अकबरपुर मार्ग पर स्थित कृष्णा होटल श्रद्धालुओं, हाईवे यात्रियों और परिवारों के लिए रुकने की सबसे अच्छी जगह है। हमें गर्व है कि हम महँगे दाम के बिना शानदार आराम देते हैं।"
                            )}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">{item.icon}</div>
                                    <span className="text-gray-700 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <a
                                href="#rooms"
                                className="text-royal-blue font-semibold hover:text-royal-blue-light flex items-center group transition-colors"
                            >
                                {t("Explore our rooms", "हमारे कमरे देखें")}
                                <span className="ml-2 group-hover:translate-x-1 duration-200 transition-transform">→</span>
                            </a>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
