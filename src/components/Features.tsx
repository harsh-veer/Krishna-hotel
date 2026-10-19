"use client";

import { useLang } from "@/lib/i18n";
import { MapPin, Sparkles, IndianRupee, ShieldCheck, Utensils, PartyPopper } from "lucide-react";

export default function Features() {
    const { t } = useLang();
    const features = [
        {
            icon: <MapPin className="h-8 w-8 text-royal-blue" />,
            title: t("Strategic Ayodhya Highway Location", "अयोध्या हाईवे पर बढ़िया लोकेशन"),
            description: t("Directly located on the Ayodhya-Akbarpur Road near Fire Station. Perfect stop for Ayodhya Ram Mandir pilgrims & family road trips.", "अयोध्या-अकबरपुर रोड पर, फ़ायर स्टेशन के पास। अयोध्या राम मंदिर के दर्शन को जाने वाले श्रद्धालुओं और परिवार के साथ सफ़र के लिए सही पड़ाव।"),
            badge: t("Prime Location", "मुख्य लोकेशन")
        },
        {
            icon: <Sparkles className="h-8 w-8 text-gold" />,
            title: t("Unmatched Cleanliness & Hygiene", "बेहतरीन साफ़-सफ़ाई"),
            description: t("Spotless AC rooms, fresh sanitized linen, clean modern bathrooms, and daily housekeeping for a refreshing stay.", "चमचमाते एसी कमरे, धुली हुई साफ़ चादरें, साफ़ आधुनिक बाथरूम और रोज़ाना कमरे की सफ़ाई।"),
            badge: t("100% Sanitized", "100% सैनिटाइज़्ड")
        },
        {
            icon: <IndianRupee className="h-8 w-8 text-green-600" />,
            title: t("Budget-Friendly Luxury", "कम बजट में आराम"),
            description: t("Enjoy premium AC comfort, high-speed Wi-Fi, and top-tier amenities at transparent prices starting from ₹999 - ₹1,500/night.", "एसी का आराम, हाई-स्पीड वाई-फ़ाई और अच्छी सुविधाएँ, साफ़ दामों पर: ₹999 - ₹1,500 प्रति रात।"),
            badge: t("Best Value", "पैसा वसूल")
        },
        {
            icon: <Utensils className="h-8 w-8 text-amber-600" />,
            title: t("Pure Veg Krishna Restaurant", "शुद्ध शाकाहारी कृष्णा रेस्टोरेंट"),
            description: t("In-house restaurant serving delicious North Indian dishes, thali, snacks, and 24/7 hot room service straight to your room.", "होटल का अपना रेस्टोरेंट, जहाँ स्वादिष्ट उत्तर भारतीय खाना, थाली और नाश्ता मिलता है, साथ में 24/7 गरम खाना सीधे आपके कमरे तक।"),
            badge: t("Pure Vegetarian", "शुद्ध शाकाहारी")
        },
        {
            icon: <PartyPopper className="h-8 w-8 text-purple-600" />,
            title: t("Grand Banquet & Event Hall", "भव्य बैंक्वेट और इवेंट हॉल"),
            description: t("Spacious venue with custom stage decorations, balloon arches, and seating for birthdays, weddings, and family events.", "जन्मदिन, शादी और पारिवारिक कार्यक्रमों के लिए बड़ा हॉल, स्टेज सजावट, गुब्बारों की सजावट और बैठने की व्यवस्था के साथ।"),
            badge: t("Event Space", "इवेंट हॉल")
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
            title: t("24/7 Security & Hospitality", "24/7 सुरक्षा और सेवा"),
            description: t("24/7 front desk, power backup generator, CCTV security, free parking, and warm family-friendly hospitality.", "24/7 रिसेप्शन, जनरेटर पावर बैकअप, सीसीटीवी सुरक्षा, मुफ़्त पार्किंग और परिवार जैसी मेहमाननवाज़ी।"),
            badge: t("Safe Stay", "सुरक्षित ठहराव")
        },
    ];

    return (
        <section id="amenities" className="py-20 bg-gradient-to-b from-royal-blue/5 to-white relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="mb-4 inline-block rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold tracking-wider text-yellow-900 uppercase shadow-sm">
                        {t("Why Customers Prefer Us", "मेहमान हमें क्यों चुनते हैं")}
                    </span>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        {t("The Krishna Hotel Advantage", "कृष्णा होटल की ख़ासियत")}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {t("Discover why road travelers, families, and Ayodhya Ram Mandir pilgrims consistently rank Krishna Hotel as their top choice.", "जानिए क्यों सड़क यात्री, परिवार और अयोध्या राम मंदिर के श्रद्धालु बार-बार कृष्णा होटल को ही चुनते हैं।")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 group-hover:bg-royal-blue/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-royal-blue group-hover:text-white transition-colors">
                                    {feature.badge}
                                </span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-heading text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
