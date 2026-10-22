"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2, Briefcase, Cake, Users, Gem, Heart, Calendar, Clock, Send, CheckCircle2 } from "lucide-react";
import EmailOtpField from "@/components/EmailOtpField";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useLang } from "@/lib/i18n";
import { MSG } from "@/lib/i18n/messages";
import { isValidIndianMobile, sanitizePhoneInput } from "@/lib/validation";
import {
    EVENT_SLOTS,
    EVENT_TYPES,
    MAX_EVENT_GUESTS,
    eventWhatsAppLink,
    isEventType,
    todayInIndia,
    type EventTypeId,
} from "@/lib/events";

const ICONS: Record<EventTypeId, React.ComponentType<{ className?: string }>> = {
    banquet: Building2,
    meeting: Briefcase,
    birthday: Cake,
    kitty: Users,
    ring: Gem,
    engagement: Heart,
};

const input = "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50";
const label = "block text-sm font-medium text-gray-700 mb-1";

const empty = { name: "", phone: "", email: "", eventDate: "", slot: "evening", guests: "", message: "" };

// Booking panel for the hall: banquet, meeting, birthday, kitty, ring ceremony and engagement.
export default function EventBookingForm() {
    const { t } = useLang();
    const [eventType, setEventType] = useState<EventTypeId>("banquet");
    const [form, setForm] = useState(empty);
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState<{ reference: string; summary: typeof empty & { eventType: EventTypeId } } | null>(null);
    const today = todayInIndia();

    // /events?type=birthday opens with that event type selected.
    useEffect(() => {
        const type = new URLSearchParams(window.location.search).get("type");
        if (isEventType(type)) setEventType(type);
    }, []);

    const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let v = value;
        if (name === "name") v = value.replace(/[^a-zA-Z\s]/g, "");
        if (name === "phone") v = sanitizePhoneInput(value);
        if (name === "guests") v = value.replace(/\D/g, "").slice(0, 4);
        setForm((f) => ({ ...f, [name]: v }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidIndianMobile(form.phone)) return void toast.error(t(MSG.phoneError));
        if (!emailVerified) return void toast.error(t(MSG.verifyEmailFirst));
        const guests = Number(form.guests);
        if (!guests || guests < 1 || guests > MAX_EVENT_GUESTS) {
            return void toast.error(t("Please enter the number of guests.", "कृपया मेहमानों की संख्या डालें।"));
        }

        setLoading(true);
        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, eventType, guests }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (data.needsVerification) setEmailVerified(false);
                toast.error(data.error || t(MSG.somethingWrong));
                return;
            }
            setDone({ reference: data.reference, summary: { ...form, eventType } });
            setForm(empty);
            setEmailVerified(false);
        } catch {
            toast.error(t(MSG.somethingWrong));
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        const typeName = EVENT_TYPES.find((x) => x.id === done.summary.eventType)!;
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" aria-hidden="true" />
                <h3 className="font-heading text-2xl font-bold text-gray-900">{t("Request received!", "अनुरोध मिल गया!")}</h3>
                <p className="mt-3 text-gray-700">
                    {t(
                        `Your ${typeName.en} request for ${done.summary.eventDate} is with our team (Ref ${done.reference}). We will call you shortly to discuss capacity, menu and charges. The hall is confirmed only after that call. A copy is on its way to your email.`,
                        `${done.summary.eventDate} के लिए आपका ${typeName.hi} का अनुरोध हमारी टीम के पास है (Ref ${done.reference})। हम जल्द ही फ़ोन करके क्षमता, मेन्यू और शुल्क पर बात करेंगे। कॉल के बाद ही हॉल कन्फ़र्म माना जाएगा। एक कॉपी आपके ईमेल पर भेजी जा रही है।`
                    )}
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                        href={eventWhatsAppLink({ name: done.summary.name, eventType: done.summary.eventType, eventDate: done.summary.eventDate, slot: done.summary.slot, guests: done.summary.guests })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20BE5A]"
                    >
                        <WhatsAppIcon />
                        {t("Confirm faster on WhatsApp", "व्हाट्सऐप पर जल्दी कन्फ़र्म करें")}
                    </a>
                    <button onClick={() => setDone(null)} className="rounded-md border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
                        {t("Make another request", "एक और अनुरोध करें")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-10">
            <fieldset>
                <legend className="mb-3 text-sm font-semibold text-gray-900">{t("1. What are you planning?", "1. आप क्या आयोजित कर रहे हैं?")}</legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {EVENT_TYPES.map((ev) => {
                        const Icon = ICONS[ev.id];
                        const active = ev.id === eventType;
                        return (
                            <button
                                key={ev.id}
                                type="button"
                                onClick={() => setEventType(ev.id)}
                                aria-pressed={active}
                                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-all ${
                                    active ? "border-royal-blue bg-royal-blue/5 shadow-sm" : "border-gray-200 hover:border-royal-blue/40"
                                }`}
                            >
                                <Icon className={`h-7 w-7 ${active ? "text-royal-blue" : "text-gray-400"}`} />
                                <span className={`text-sm font-semibold ${active ? "text-royal-blue" : "text-gray-800"}`}>{t(ev.en, ev.hi)}</span>
                                <span className="hidden text-xs text-gray-500 sm:block">{t(ev.blurb)}</span>
                            </button>
                        );
                    })}
                </div>
            </fieldset>

            <div className="space-y-5">
                <p className="text-sm font-semibold text-gray-900">{t("2. When and how many?", "2. कब और कितने लोग?")}</p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div>
                        <label htmlFor="eventDate" className={label}>{t("Event date", "आयोजन की तारीख़")}</label>
                        <div className="relative">
                            <input type="date" id="eventDate" name="eventDate" value={form.eventDate} onChange={change} min={today} required className={`${input} pl-11`} />
                            <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="slot" className={label}>{t("Time", "समय")}</label>
                        <div className="relative">
                            <select id="slot" name="slot" value={form.slot} onChange={change} className={`${input} appearance-none pl-11`}>
                                {EVENT_SLOTS.map((s) => (
                                    <option key={s.id} value={s.id}>{t(s.en, s.hi)}</option>
                                ))}
                            </select>
                            <Clock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="guests" className={label}>{t("Approx. guests", "अनुमानित मेहमान")}</label>
                        <input type="text" inputMode="numeric" id="guests" name="guests" value={form.guests} onChange={change} required placeholder="e.g. 100" className={input} />
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <p className="text-sm font-semibold text-gray-900">{t("3. Your details", "3. आपकी जानकारी")}</p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="ev-name" className={label}>{t("Full name", "पूरा नाम")}</label>
                        <input type="text" id="ev-name" name="name" value={form.name} onChange={change} required maxLength={60} autoComplete="name" placeholder={t("Your full name", "आपका पूरा नाम")} className={input} />
                    </div>
                    <div>
                        <label htmlFor="ev-phone" className={label}>{t("Mobile number", "मोबाइल नंबर")}</label>
                        <input type="tel" id="ev-phone" name="phone" value={form.phone} onChange={change} required inputMode="tel" autoComplete="tel" maxLength={13} placeholder={t("10-digit mobile, e.g. 9876543210", "10 अंक, जैसे 9876543210")} className={input} />
                    </div>
                </div>
                <EmailOtpField
                    id="ev-email"
                    email={form.email}
                    onEmailChange={(email) => setForm((f) => ({ ...f, email }))}
                    verified={emailVerified}
                    onVerifiedChange={setEmailVerified}
                />
                <div>
                    <label htmlFor="ev-message" className={label}>{t("Anything we should know? (optional)", "कुछ और बताना चाहें? (वैकल्पिक)")}</label>
                    <textarea id="ev-message" name="message" value={form.message} onChange={change} maxLength={500} rows={3} placeholder={t("Decoration, food, stage, rooms for guests...", "सजावट, खाना, स्टेज, मेहमानों के लिए कमरे...")} className={input} />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading || !emailVerified}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-royal-blue px-6 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-royal-blue-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>{loading ? t("Sending...", "भेजा जा रहा है...") : !emailVerified ? t(MSG.verifyEmailToContinue) : t("Send Event Request", "आयोजन अनुरोध भेजें")}</span>
                    {!loading && <Send className="h-4 w-4" />}
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                    {t("No payment now. We will call you to discuss capacity, menu and charges.", "अभी कोई भुगतान नहीं। हम फ़ोन करके क्षमता, मेन्यू और शुल्क पर बात करेंगे।")}
                </p>
                <p className="mt-2 text-center text-sm">
                    <a
                        href={eventWhatsAppLink({ name: form.name, eventType, eventDate: form.eventDate, slot: form.slot, guests: form.guests })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-green-600 hover:underline"
                    >
                        {t(MSG.orBookOnWhatsApp)}
                    </a>
                </p>
            </div>
        </form>
    );
}
