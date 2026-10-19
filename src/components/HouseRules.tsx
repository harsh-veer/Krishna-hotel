"use client";

import { Clock, Wallet, CalendarX, IdCard, BedDouble } from "lucide-react";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  EXTRA_BED_PRICE,
  ID_PROOFS,
  PAYMENT_METHODS,
} from "@/lib/hotel";
import { useLang, type Text } from "@/lib/i18n";

// Hindi for the hotel.ts values; a value not listed here (after an edit there) shows as written.
const PAYMENT_HI: Record<string, string> = { Cash: "नकद", UPI: "UPI", Card: "कार्ड" };
const ID_PROOFS_HI: Record<string, string> = {
  "Aadhaar, passport, driving licence or voter ID": "आधार, पासपोर्ट, ड्राइविंग लाइसेंस या वोटर आईडी",
};

const rules: { icon: typeof Clock; title: Text; detail: Text }[] = [
  {
    icon: Clock,
    title: {
      en: `Check-in ${CHECK_IN_TIME} · Check-out ${CHECK_OUT_TIME}`,
      hi: `चेक-इन ${CHECK_IN_TIME} · चेक-आउट ${CHECK_OUT_TIME}`,
    },
    detail: {
      en: "Early check-in or late check-out on request, subject to availability.",
      hi: "कमरा खाली होने पर, माँगने पर जल्दी चेक-इन या देर से चेक-आउट।",
    },
  },
  {
    icon: Wallet,
    title: { en: "No advance payment", hi: "कोई एडवांस नहीं" },
    detail: {
      en: `Pay at the hotel on arrival: ${PAYMENT_METHODS.join(", ")}.`,
      hi: `होटल पहुँचकर भुगतान करें: ${PAYMENT_METHODS.map((m) => PAYMENT_HI[m] ?? m).join(", ")}।`,
    },
  },
  {
    icon: CalendarX,
    title: { en: "Free to change or cancel", hi: "बदलाव या कैंसिल मुफ़्त" },
    detail: {
      en: "Plans changed? Just call or WhatsApp +91 86046 80149.",
      hi: "प्लान बदल गया? बस +91 86046 80149 पर कॉल या व्हाट्सऐप करें।",
    },
  },
  {
    icon: IdCard,
    title: { en: "Photo ID required", hi: "फ़ोटो आईडी ज़रूरी" },
    detail: {
      en: `Every adult guest needs a valid ID at check-in (${ID_PROOFS}).`,
      hi: `चेक-इन के समय हर वयस्क मेहमान का वैध आईडी ज़रूरी है (${ID_PROOFS_HI[ID_PROOFS] ?? ID_PROOFS})।`,
    },
  },
  {
    icon: BedDouble,
    title: { en: "Extra mattress", hi: "अतिरिक्त गद्दा" },
    detail:
      EXTRA_BED_PRICE !== null
        ? {
            en: `Available for a third guest at ₹${EXTRA_BED_PRICE} per night.`,
            hi: `तीसरे मेहमान के लिए ₹${EXTRA_BED_PRICE} प्रति रात में उपलब्ध।`,
          }
        : {
            en: "Available for a third guest on request; ask reception for the price.",
            hi: "तीसरे मेहमान के लिए माँगने पर उपलब्ध; दाम के लिए रिसेप्शन से पूछें।",
          },
  },
];

// Shown beside the booking forms so guests know the terms before they send a request.
export default function HouseRules({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50/70 ${compact ? "p-3" : "p-4"}`}>
      <p className={`font-semibold text-gray-900 ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}>
        {t("Good to know before you book", "बुकिंग से पहले जान लें")}
      </p>
      <ul className={compact ? "space-y-2" : "space-y-2.5"}>
        {rules.map(({ icon: Icon, title, detail }) => (
          <li key={title.en} className="flex items-start gap-2.5">
            <Icon className={`shrink-0 text-royal-blue mt-0.5 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <div className={compact ? "text-[11px] leading-snug" : "text-xs leading-snug"}>
              <span className="font-semibold text-gray-800">{t(title)}</span>
              <span className="text-gray-500"> · {t(detail)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
