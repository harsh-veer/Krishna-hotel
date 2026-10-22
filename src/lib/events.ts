// Event hall bookings: types, time slots and shared validation. Safe to import in the browser and on the server.
// Capacity and prices are not listed on purpose; the front desk quotes them after the request.

export const EVENT_TYPES = [
  { id: "banquet", en: "Banquet Hall", hi: "बैंक्वेट हॉल", blurb: { en: "Weddings, receptions and big functions", hi: "शादी, रिसेप्शन और बड़े समारोह" } },
  { id: "meeting", en: "Meeting Hall", hi: "मीटिंग हॉल", blurb: { en: "Business meetings, trainings and seminars", hi: "बिज़नेस मीटिंग, ट्रेनिंग और सेमिनार" } },
  { id: "birthday", en: "Birthday Party", hi: "बर्थडे पार्टी", blurb: { en: "Birthdays for kids and families", hi: "बच्चों और परिवार के जन्मदिन" } },
  { id: "kitty", en: "Kitty Party", hi: "किटी पार्टी", blurb: { en: "Get-togethers and ladies' kitty", hi: "गेट-टुगेदर और लेडीज़ किटी" } },
  { id: "ring", en: "Ring Ceremony", hi: "रिंग सेरेमनी", blurb: { en: "Ring exchange and roka functions", hi: "रिंग सेरेमनी और रोका" } },
  { id: "engagement", en: "Engagement Hall", hi: "सगाई हॉल", blurb: { en: "Engagement ceremonies with decorated stage", hi: "सजे मंच के साथ सगाई समारोह" } },
] as const;

export type EventTypeId = (typeof EVENT_TYPES)[number]["id"];

// Time slots are labels only. Add clock times here once the hall timings are fixed.
export const EVENT_SLOTS = [
  { id: "morning", en: "Morning", hi: "सुबह" },
  { id: "afternoon", en: "Afternoon", hi: "दोपहर" },
  { id: "evening", en: "Evening", hi: "शाम" },
  { id: "fullday", en: "Full day", hi: "पूरा दिन" },
] as const;

export type EventSlotId = (typeof EVENT_SLOTS)[number]["id"];

export const EVENT_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"] as const;

export const MIN_EVENT_GUESTS = 1;
export const MAX_EVENT_GUESTS = 2000;

export const eventTypeName = (id: string) => EVENT_TYPES.find((e) => e.id === id)?.en ?? id;
export const eventSlotName = (id: string) => EVENT_SLOTS.find((s) => s.id === id)?.en ?? id;
export const isEventType = (id: unknown): id is EventTypeId => EVENT_TYPES.some((e) => e.id === id);
export const isEventSlot = (id: unknown): id is EventSlotId => EVENT_SLOTS.some((s) => s.id === id);

// Today's date in India (YYYY-MM-DD). The server runs in UTC, so a plain toISOString() can be a day behind.
export const todayInIndia = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

export const WHATSAPP_EVENT_NUMBER = "918604680149";

export function eventWhatsAppLink(d: { name?: string; eventType?: string; eventDate?: string; slot?: string; guests?: string | number }) {
  const lines = ["Hello Krishna Hotel, I want to book your hall for an event."];
  if (d.eventType) lines.push(`Event: ${eventTypeName(d.eventType)}`);
  if (d.eventDate) lines.push(`Date: ${d.eventDate}`);
  if (d.slot) lines.push(`Time: ${eventSlotName(d.slot)}`);
  if (d.guests) lines.push(`Guests: ${d.guests}`);
  if (d.name) lines.push(`Name: ${d.name}`);
  return `https://wa.me/${WHATSAPP_EVENT_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
