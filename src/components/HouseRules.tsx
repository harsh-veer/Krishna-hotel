import { Clock, Wallet, CalendarX, IdCard, BedDouble } from "lucide-react";
import {
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  EXTRA_BED_PRICE,
  ID_PROOFS,
  PAYMENT_METHODS,
} from "@/lib/hotel";

const rules = [
  {
    icon: Clock,
    title: `Check-in ${CHECK_IN_TIME} · Check-out ${CHECK_OUT_TIME}`,
    detail: "Early check-in or late check-out on request, subject to availability.",
  },
  {
    icon: Wallet,
    title: "No advance payment",
    detail: `Pay at the hotel on arrival: ${PAYMENT_METHODS.join(", ")}.`,
  },
  {
    icon: CalendarX,
    title: "Free to change or cancel",
    detail: "Plans changed? Just call or WhatsApp +91 86046 80149.",
  },
  {
    icon: IdCard,
    title: "Photo ID required",
    detail: `Every adult guest needs a valid ID at check-in (${ID_PROOFS}).`,
  },
  {
    icon: BedDouble,
    title: "Extra mattress",
    detail:
      EXTRA_BED_PRICE !== null
        ? `Available for a third guest at ₹${EXTRA_BED_PRICE} per night.`
        : "Available for a third guest on request; ask reception for the price.",
  },
];

// Shown beside the booking forms so guests know the terms before they send a request.
export default function HouseRules({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-gray-50/70 ${compact ? "p-3" : "p-4"}`}>
      <p className={`font-semibold text-gray-900 ${compact ? "text-xs mb-2" : "text-sm mb-3"}`}>
        Good to know before you book
      </p>
      <ul className={compact ? "space-y-2" : "space-y-2.5"}>
        {rules.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-2.5">
            <Icon className={`shrink-0 text-royal-blue mt-0.5 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            <div className={compact ? "text-[11px] leading-snug" : "text-xs leading-snug"}>
              <span className="font-semibold text-gray-800">{title}</span>
              <span className="text-gray-500"> · {detail}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
