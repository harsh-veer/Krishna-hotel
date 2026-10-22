// Single source for hotel facts shown in several places (badges, reviews, structured data).
// Update GOOGLE_RATING / GOOGLE_REVIEW_COUNT when the Google Business Profile changes.
export const SITE_URL = "https://krishnaahotel.in";
export const HOTEL_NAME = "Krishna Hotel";
export const PHONE = "+918604680149";
export const WHATSAPP_NUMBER = "918604680149";
export const GOOGLE_RATING = 3.8;
export const GOOGLE_REVIEW_COUNT = 180;
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/Krishna+Hotel+Akbarpur+Ambedkar+Nagar/";
// Link sent to guests after check-out. Replace with the "Ask for reviews" link from
// Google Business Profile (looks like https://g.page/r/XXXX/review) so it opens the review box directly.
export const GOOGLE_WRITE_REVIEW_URL = GOOGLE_REVIEWS_URL;

// House rules shown next to the booking buttons. Edit these to match how the front desk works.
// Set EXTRA_BED_PRICE to a number (e.g. 300) to show the price; null shows "ask at reception".
export const CHECK_IN_TIME = "12:00 PM";
export const CHECK_OUT_TIME = "11:00 AM";
export const EXTRA_BED_PRICE: number | null = null;
export const PAYMENT_METHODS = ["Cash", "UPI"];
export const ID_PROOFS = "Aadhaar, passport, driving licence or voter ID";

// Builds a wa.me link with a ready-to-send booking message from whatever the guest has filled in.
export function bookingWhatsAppLink(details: {
  name?: string;
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}) {
  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "";
  const lines = [
    `Hi ${HOTEL_NAME}, I'd like to book a room.`,
    details.name?.trim() && `Name: ${details.name.trim()}`,
    details.roomType && `Room: ${details.roomType}`,
    details.checkIn && `Check-in: ${fmt(details.checkIn)}`,
    details.checkOut && `Check-out: ${fmt(details.checkOut)}`,
    details.guests && `Guests: ${details.guests}`,
  ].filter(Boolean);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
