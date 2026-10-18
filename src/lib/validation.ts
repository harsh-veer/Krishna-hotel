// Shared by the booking forms (browser) and the API routes (server).

// Indian mobile: 10 digits starting with 6-9, optionally written with +91, 91 or 0 in front.
const INDIAN_MOBILE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const PHONE_ERROR = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
export const EMAIL_ERROR = "Please use a Gmail address (@gmail.com) or an email ending in .in.";

export const isValidIndianMobile = (raw: string) =>
    INDIAN_MOBILE_REGEX.test(raw.replace(/[\s-]/g, ""));

// Stored and shown as +91XXXXXXXXXX.
export const normalizeIndianMobile = (raw: string) => "+91" + raw.replace(/\D/g, "").slice(-10);

// Keeps an optional leading "+" and digits only, capped at "+91" plus 10 digits.
export const sanitizePhoneInput = (value: string) => {
    const cleaned = value.startsWith("+")
        ? "+" + value.slice(1).replace(/\D/g, "")
        : value.replace(/\D/g, "");
    return cleaned.slice(0, 13);
};

// Only @gmail.com or any domain ending in .in (e.g. yahoo.in, company.co.in).
export const BOOKING_EMAIL_REGEX = /^[a-z0-9._%+-]+@(?:gmail\.com|(?:[a-z0-9-]+\.)+in)$/i;

export const isValidBookingEmail = (email: string) => BOOKING_EMAIL_REGEX.test(email.trim());
