"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useLang } from "@/lib/i18n";

const faqs = [
    {
        question: "What are the check-in and check-out times?",
        answer: "Our standard check-in time is 12:00 PM, and check-out time is 11:00 AM. If you need early check-in or late check-out, please contact us in advance and we will do our best to accommodate you based on availability.",
        questionHi: "चेक-इन और चेक-आउट का समय क्या है?",
        answerHi: "हमारा चेक-इन समय दोपहर 12:00 बजे और चेक-आउट समय सुबह 11:00 बजे है। अगर आपको जल्दी चेक-इन या देर से चेक-आउट चाहिए, तो पहले से बता दें, कमरा खाली होने पर हम पूरी कोशिश करेंगे।"
    },
    {
        question: "Is there safe parking available?",
        answer: "Yes, we offer ample, free, and secure parking on our premises for both cars and larger vehicles. It is safely monitored 24/7.",
        questionHi: "क्या सुरक्षित पार्किंग है?",
        answerHi: "हाँ, होटल परिसर में कार और बड़ी गाड़ियों के लिए बड़ी, मुफ़्त और सुरक्षित पार्किंग है, जिस पर 24/7 निगरानी रहती है।"
    },
    {
        question: "Is the hotel family-friendly?",
        answer: "Absolutely! We pride ourselves on being a safe and comfortable environment for families. We offer spacious family rooms and are located in a very secure area.",
        questionHi: "क्या होटल परिवार के लिए सही है?",
        answerHi: "बिल्कुल! हमारा होटल परिवारों के लिए सुरक्षित और आरामदायक है। हमारे पास बड़े फ़ैमिली कमरे हैं और होटल बहुत सुरक्षित इलाके में है।"
    },
    {
        question: "Do you offer food and room service?",
        answer: "Yes, we have a fully functioning restaurant serving delicious meals, and we also offer 24/7 room service so you can enjoy your meals in the comfort of your room.",
        questionHi: "क्या खाना और रूम सर्विस मिलती है?",
        answerHi: "हाँ, हमारा अपना रेस्टोरेंट है जहाँ स्वादिष्ट खाना मिलता है, और 24/7 रूम सर्विस भी है ताकि आप आराम से अपने कमरे में खाना खा सकें।"
    },
    {
        question: "Is Banquet facility available?",
        answer: "Yes, we have a banquet facility available for parties and events.",
        questionHi: "क्या बैंक्वेट हॉल की सुविधा है?",
        answerHi: "हाँ, पार्टी और कार्यक्रमों के लिए हमारे पास बैंक्वेट हॉल है।"
    }
];

// Only the open answer is in the HTML, so all answers also go out as FAQPage data for search engines.
// The structured data stays English, like the server-rendered page.
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const { t } = useLang();

    return (
        <section className="py-20 bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center rounded-full bg-royal-blue/10 p-3 mb-4 text-royal-blue">
                        <MessageCircleQuestion className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        {t("Frequently Asked Questions", "अक्सर पूछे जाने वाले सवाल")}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {t("Everything you need to know before you stay with us.", "हमारे यहाँ ठहरने से पहले की सारी ज़रूरी जानकारी।")}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${openIndex === index ? 'border-royal-blue bg-royal-blue/5' : 'border-gray-200 bg-white hover:border-royal-blue/30'}`}
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                                aria-expanded={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-semibold text-gray-900">{t(faq.question, faq.questionHi)}</span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex-shrink-0 ml-4 rounded-full p-1 ${openIndex === index ? 'bg-royal-blue text-white' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-royal-blue/10 pt-4">
                                            {t(faq.answer, faq.answerHi)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
