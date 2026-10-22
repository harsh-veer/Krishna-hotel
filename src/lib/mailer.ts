import nodemailer from "nodemailer";
import {
  bookingWhatsAppLink,
  CHECK_IN_TIME,
  CHECK_OUT_TIME,
  GOOGLE_WRITE_REVIEW_URL,
  ID_PROOFS,
  PAYMENT_METHODS,
} from "@/lib/hotel";
import { eventSlotName, eventTypeName, eventWhatsAppLink } from "@/lib/events";

// Sends through a Gmail account using an App Password (free, about 500 emails a day).
// Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local / Vercel environment variables.
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: pass.replace(/\s+/g, "") },
    });
  }
  return transporter;
}

export async function sendOtpEmail(to: string, code: string) {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without Gmail set up: print the code instead of emailing it.
      console.log(`[OTP] ${to}: ${code}`);
      return;
    }
    throw new Error("Email sending is not configured (GMAIL_USER / GMAIL_APP_PASSWORD).");
  }

  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${code} is your Krishna Hotel verification code`,
    text: `Your Krishna Hotel verification code is ${code}.\n\nIt is valid for 10 minutes. If you did not request this, you can ignore this email.\n\nKrishna Hotel, Ayodhya-Akbarpur Road, Ambedkar Nagar\n+91 86046 80149`,
    html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="color:#1e3a8a;margin:0 0 12px">Krishna Hotel</h2>
  <p style="margin:0 0 16px;color:#374151">Use this code to confirm your booking request:</p>
  <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:0 0 16px;color:#111827">${code}</p>
  <p style="margin:0;color:#6b7280;font-size:13px">Valid for 10 minutes. If you did not request this, you can ignore this email.</p>
  <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Ayodhya-Akbarpur Road, Ambedkar Nagar · +91 86046 80149</p>
</div>`,
  });
}

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

// Sent to the guest right after a booking request is saved. It is a receipt, not a confirmation:
// the front desk still calls to confirm availability.
export async function sendBookingRequestEmail(booking: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Booking email] would send ${booking.reference} to ${booking.email}`);
    }
    return;
  }

  const whatsapp = bookingWhatsAppLink(booking);
  const rows: [string, string][] = [
    ["Reference", booking.reference],
    ["Room", booking.roomType],
    ["Check-in", `${formatDate(booking.checkIn)}, from ${CHECK_IN_TIME}`],
    ["Check-out", `${formatDate(booking.checkOut)}, by ${CHECK_OUT_TIME}`],
    ["Guests", booking.guests],
    ["Phone", booking.phone],
  ];

  const text = [
    `Namaste ${booking.name},`,
    "",
    "Thank you for choosing Krishna Hotel. We have received your booking request:",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `Our front desk will call you on ${booking.phone} shortly to confirm availability. Your room is confirmed only after that call.`,
    "",
    `No advance payment is needed. Pay at the hotel (${PAYMENT_METHODS.join(", ")}).`,
    `Please bring a valid photo ID for every adult (${ID_PROOFS}).`,
    "To change or cancel, call or WhatsApp +91 86046 80149.",
    "",
    `Message us on WhatsApp: ${whatsapp}`,
    "",
    "Krishna Hotel, Ayodhya-Akbarpur Road, Near Fire Station, Ambedkar Nagar 224122",
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;color:#374151">
  <h2 style="color:#1e3a8a;margin:0 0 4px">Krishna Hotel</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Ayodhya-Akbarpur Road, Ambedkar Nagar</p>
  <p style="margin:0 0 12px">Namaste ${escapeHtml(booking.name)},</p>
  <p style="margin:0 0 16px">Thank you for choosing Krishna Hotel. We have received your booking request:</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 0;color:#6b7280;width:110px">${k}</td><td style="padding:6px 0;font-weight:bold;color:#111827">${escapeHtml(v)}</td></tr>`
      )
      .join("")}
  </table>
  <p style="margin:0 0 16px;padding:12px;background:#eff6ff;border-radius:8px;font-size:14px">Our front desk will call you on <b>${escapeHtml(booking.phone)}</b> shortly to confirm availability. Your room is confirmed only after that call.</p>
  <ul style="margin:0 0 20px;padding-left:18px;font-size:13px;color:#4b5563;line-height:1.6">
    <li>No advance payment. Pay at the hotel (${PAYMENT_METHODS.join(", ")}).</li>
    <li>Bring a valid photo ID for every adult (${ID_PROOFS}).</li>
    <li>To change or cancel, call or WhatsApp +91 86046 80149.</li>
  </ul>
  <a href="${whatsapp}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:8px">Message us on WhatsApp</a>
</div>`;

  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: `Booking request received: ${booking.roomType}, ${formatDate(booking.checkIn)} (Ref ${booking.reference})`,
    text,
    html,
  });
}

// Sent when the front desk marks a booking Confirmed or Cancelled in /admin.
export async function sendBookingStatusEmail(booking: {
  reference: string;
  name: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  status: "Confirmed" | "Cancelled";
}): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Status email] would send ${booking.status} for ${booking.reference} to ${booking.email}`);
    }
    return false;
  }

  const confirmed = booking.status === "Confirmed";
  const whatsapp = bookingWhatsAppLink(booking);
  const rows: [string, string][] = [
    ["Reference", booking.reference],
    ["Room", booking.roomType],
    ["Check-in", `${formatDate(booking.checkIn)}, from ${CHECK_IN_TIME}`],
    ["Check-out", `${formatDate(booking.checkOut)}, by ${CHECK_OUT_TIME}`],
    ["Guests", booking.guests],
  ];
  const intro = confirmed
    ? "Good news! Your booking at Krishna Hotel is confirmed:"
    : "Your booking request at Krishna Hotel has been cancelled:";
  const notes = confirmed
    ? [
        `Pay at the hotel (${PAYMENT_METHODS.join(", ")}). No advance payment is needed.`,
        `Please bring a valid photo ID for every adult (${ID_PROOFS}).`,
        "To change or cancel, call or WhatsApp +91 86046 80149.",
      ]
    : [
        "If you did not ask for this or would like to book other dates, call or WhatsApp +91 86046 80149.",
      ];

  const text = [
    `Namaste ${booking.name},`,
    "",
    intro,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...notes,
    "",
    `WhatsApp: ${whatsapp}`,
    "",
    "Krishna Hotel, Ayodhya-Akbarpur Road, Near Fire Station, Ambedkar Nagar 224122",
  ].join("\n");

  const accent = confirmed ? "#15803d" : "#b91c1c";
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;color:#374151">
  <h2 style="color:#1e3a8a;margin:0 0 4px">Krishna Hotel</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Ayodhya-Akbarpur Road, Ambedkar Nagar</p>
  <p style="margin:0 0 12px">Namaste ${escapeHtml(booking.name)},</p>
  <p style="margin:0 0 16px;font-weight:bold;color:${accent}">${intro}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 0;color:#6b7280;width:110px">${k}</td><td style="padding:6px 0;font-weight:bold;color:#111827">${escapeHtml(v)}</td></tr>`
      )
      .join("")}
  </table>
  <ul style="margin:0 0 20px;padding-left:18px;font-size:13px;color:#4b5563;line-height:1.6">
    ${notes.map((n) => `<li>${n}</li>`).join("")}
  </ul>
  <a href="${whatsapp}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:8px">Message us on WhatsApp</a>
</div>`;

  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to: booking.email,
    subject: confirmed
      ? `Booking confirmed: ${booking.roomType}, ${formatDate(booking.checkIn)} (Ref ${booking.reference})`
      : `Booking cancelled: ${booking.roomType}, ${formatDate(booking.checkIn)} (Ref ${booking.reference})`,
    text,
    html,
  });
  return true;
}

// Sent when the front desk marks a booking Checked-out in /admin: thanks the guest and asks for a Google review.
export async function sendReviewRequestEmail(guest: { name: string; email: string }): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Review email] would ask ${guest.email} for a review`);
    }
    return false;
  }

  const text = [
    `Namaste ${guest.name},`,
    "",
    "Thank you for staying at Krishna Hotel. We hope you had a comfortable stay.",
    "",
    "Could you spare 30 seconds to rate us on Google? Your review helps other travellers find us and helps us improve.",
    "",
    `Rate us on Google: ${GOOGLE_WRITE_REVIEW_URL}`,
    "",
    "If anything was not right, please reply to this email or WhatsApp +91 86046 80149. We'd like to make it right.",
    "",
    "Krishna Hotel, Ayodhya-Akbarpur Road, Near Fire Station, Ambedkar Nagar 224122",
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;color:#374151">
  <h2 style="color:#1e3a8a;margin:0 0 4px">Krishna Hotel</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Ayodhya-Akbarpur Road, Ambedkar Nagar</p>
  <p style="margin:0 0 12px">Namaste ${escapeHtml(guest.name)},</p>
  <p style="margin:0 0 12px">Thank you for staying at Krishna Hotel. We hope you had a comfortable stay.</p>
  <p style="margin:0 0 20px">Could you spare 30 seconds to rate us on Google? Your review helps other travellers find us and helps us improve.</p>
  <p style="margin:0 0 6px;font-size:28px;letter-spacing:4px;color:#eab308">★★★★★</p>
  <a href="${GOOGLE_WRITE_REVIEW_URL}" style="display:inline-block;background:#1e3a8a;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px">Rate us on Google</a>
  <p style="margin:20px 0 0;font-size:13px;color:#6b7280">If anything was not right, just reply to this email or WhatsApp +91 86046 80149. We'd like to make it right.</p>
</div>`;

  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to: guest.email,
    subject: "Thank you for staying at Krishna Hotel 🙏 How was your stay?",
    text,
    html,
  });
  return true;
}

type EventMail = {
  reference: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  slot: string;
  guests: number;
};

function eventEmail(b: EventMail, headline: string, note: string, accent: string) {
  const whatsapp = eventWhatsAppLink({ name: b.name, eventType: b.eventType, eventDate: b.eventDate, slot: b.slot, guests: b.guests });
  const rows: [string, string][] = [
    ["Reference", b.reference],
    ["Event", eventTypeName(b.eventType)],
    ["Date", formatDate(b.eventDate)],
    ["Time", eventSlotName(b.slot)],
    ["Guests", String(b.guests)],
    ["Phone", b.phone],
  ];
  const text = [
    `Namaste ${b.name},`,
    "",
    headline,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    note,
    "",
    `WhatsApp us: ${whatsapp}`,
    "",
    "Krishna Hotel, Ayodhya-Akbarpur Road, Near Fire Station, Ambedkar Nagar 224122",
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;color:#374151">
  <h2 style="color:#1e3a8a;margin:0 0 4px">Krishna Hotel</h2>
  <p style="margin:0 0 20px;color:#6b7280;font-size:13px">Banquet &amp; event halls, Ayodhya-Akbarpur Road, Ambedkar Nagar</p>
  <p style="margin:0 0 12px">Namaste ${escapeHtml(b.name)},</p>
  <p style="margin:0 0 16px;font-weight:bold;color:${accent}">${escapeHtml(headline)}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 0;color:#6b7280;width:110px">${k}</td><td style="padding:6px 0;font-weight:bold;color:#111827">${escapeHtml(v)}</td></tr>`
      )
      .join("")}
  </table>
  <p style="margin:0 0 20px;padding:12px;background:#eff6ff;border-radius:8px;font-size:14px">${escapeHtml(note)}</p>
  <a href="${whatsapp}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:8px">Message us on WhatsApp</a>
</div>`;
  return { text, html };
}

// Sent right after an event hall request is saved. It is a receipt: the hall is confirmed only after the front desk calls.
export async function sendEventRequestEmail(b: EventMail) {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") console.log(`[Event email] would send ${b.reference} to ${b.email}`);
    return;
  }
  const { text, html } = eventEmail(
    b,
    "We have received your event request:",
    `Our team will call you on ${b.phone} shortly to discuss capacity, menu and charges. The hall is confirmed only after that call.`,
    "#1e3a8a"
  );
  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to: b.email,
    subject: `Event request received: ${eventTypeName(b.eventType)}, ${formatDate(b.eventDate)} (Ref ${b.reference})`,
    text,
    html,
  });
}

// Sent when the front desk marks an event Confirmed or Cancelled in /admin.
export async function sendEventStatusEmail(b: EventMail & { status: "Confirmed" | "Cancelled" }): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") console.log(`[Event status email] would send ${b.status} for ${b.reference}`);
    return false;
  }
  const confirmed = b.status === "Confirmed";
  const { text, html } = eventEmail(
    b,
    confirmed ? "Your event booking at Krishna Hotel is confirmed:" : "Your event request at Krishna Hotel has been cancelled:",
    confirmed
      ? "We look forward to hosting you. To change anything, call or WhatsApp +91 86046 80149."
      : "If you did not ask for this or would like another date, call or WhatsApp +91 86046 80149.",
    confirmed ? "#15803d" : "#b91c1c"
  );
  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to: b.email,
    subject: `Event ${confirmed ? "confirmed" : "cancelled"}: ${eventTypeName(b.eventType)}, ${formatDate(b.eventDate)} (Ref ${b.reference})`,
    text,
    html,
  });
  return true;
}
