"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqs = [
    {
        question: "What are the check-in and check-out times?",
        answer: "Our standard check-in time is 12:00 PM, and check-out time is 11:00 AM. If you need early check-in or late check-out, please contact us in advance and we will do our best to accommodate you based on availability."
    },
    {
        question: "Is there safe parking available?",
        answer: "Yes, we offer ample, free, and secure parking on our premises for both cars and larger vehicles. It is safely monitored 24/7."
    },
    {
        question: "Is the hotel family-friendly?",
        answer: "Absolutely! We pride ourselves on being a safe and comfortable environment for families. We offer spacious family rooms and are located in a very secure area."
    },
    {
        question: "Do you offer food and room service?",
        answer: "Yes, we have a fully functioning restaurant serving delicious meals, and we also offer 24/7 room service so you can enjoy your meals in the comfort of your room."
    },
    {
        question: "Is Banquet facility available?",
        answer: "Yes, we have a banquet facility available for parties and events."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-white">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center rounded-full bg-royal-blue/10 p-3 mb-4 text-royal-blue">
                        <MessageCircleQuestion className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Everything you need to know before you stay with us.
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
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
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
                                            {faq.answer}
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
