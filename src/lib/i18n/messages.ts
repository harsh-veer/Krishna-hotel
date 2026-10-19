import { EMAIL_ERROR, PHONE_ERROR } from "@/lib/validation";
import type { Text } from "@/lib/i18n";

// Messages shared by several booking forms. Use with t(MSG.phoneError).
export const MSG = {
  phoneError: {
    en: PHONE_ERROR,
    hi: "कृपया सही 10 अंकों का भारतीय मोबाइल नंबर डालें (जैसे 9876543210)।",
  },
  emailError: {
    en: EMAIL_ERROR,
    hi: "कृपया Gmail पता (@gmail.com) या .in पर ख़त्म होने वाला ईमेल डालें।",
  },
  verifyEmailFirst: {
    en: "Please verify your email with the 6-digit code first.",
    hi: "कृपया पहले 6 अंकों के कोड से अपना ईमेल वेरिफ़ाई करें।",
  },
  somethingWrong: {
    en: "Something went wrong. Please try again.",
    hi: "कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।",
  },
  orBookOnWhatsApp: { en: "Or book on WhatsApp", hi: "या व्हाट्सऐप पर बुक करें" },
  soldOut: {
    en: "❌ Sold Out: No rooms available for these dates.",
    hi: "❌ फ़ुल: इन तारीख़ों पर कोई कमरा ख़ाली नहीं है।",
  },
  verifyEmailToContinue: { en: "Verify Email to Continue", hi: "आगे बढ़ने के लिए ईमेल वेरिफ़ाई करें" },
} satisfies Record<string, Text>;
