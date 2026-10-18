import {
  Wifi,
  Tv,
  Wind,
  Bed,
  ShowerHead,
  Coffee,
  type LucideIcon,
} from "lucide-react";

export interface RoomData {
  name: string;
  price: string;
  image: string;
  description: string;
  longDescription: string;
  maxGuests: string;
  bedType: string;
  bathType: string;
  amenities: { icon: LucideIcon; name: string }[];
  faqs: { q: string; a: string }[];
}

export const ROOMS_DATA: Record<string, RoomData> = {
  "super-deluxe-room": {
    name: "Super-Deluxe Room",
    price: "₹1,500",
    image: "/images/RUID6be30bebb9614ed3a6ae2bfdf8886bb5.jpg",
    description: "Cozy and budget-friendly room perfect for solo travelers or couples.",
    longDescription: "Experience a superior standard of comfort in our Super-Deluxe Room. This room is thoughtfully designed to blend modern luxury with budget-friendly pricing. Featuring premium furniture, a plush queen-sized bed, high-power split air-conditioning, and a flat-screen smart TV for entertainment. Perfect for couples, business executives, or family members traveling to Ayodhya. Enjoy complimentary high-speed Wi-Fi, daily housekeeping, and premium bathroom amenities.",
    maxGuests: "2-3 Guests",
    bedType: "1 Queen Bed",
    bathType: "Premium Bath",
    amenities: [
      { icon: Wifi, name: "Free High-Speed Wi-Fi" },
      { icon: Wind, name: "Split Air Conditioning (AC)" },
      { icon: Tv, name: "32\" Smart LED TV" },
      { icon: Bed, name: "Comfortable Queen Bed" },
      { icon: ShowerHead, name: "Premium Toiletries & Towels" },
    ],
    faqs: [
      { q: "Is extra bedding available?", a: "Yes, we can provide an extra mattress for a third guest upon request for a small fee." },
      { q: "Is split AC available?", a: "Yes, this room features a modern, quiet split air conditioner with climate control." }
    ]
  },
  "standard-ac-room": {
    name: "Standard Ac Room",
    price: "₹1,200",
    image: "/images/RUID0ab0ad48ea4f4b1db907503b22e4fafd.jpg",
    description: "Spacious enough for the whole family with extra bedding and premium amenities.",
    longDescription: "The Standard AC Room is our most popular option for highway travelers and families seeking value without compromising on comfort. Spaciously laid out with a large double bed, excellent split air conditioning, and a flat-screen TV. Safe and secure parking, immediate hot water supply, and clean, attached western toilets make this room a comfortable retreat after a long day of travel on the Ayodhya highway.",
    maxGuests: "2 Guests",
    bedType: "1 Double Bed",
    bathType: "Attached Bath",
    amenities: [
      { icon: Wifi, name: "Free High-Speed Wi-Fi" },
      { icon: Wind, name: "Air Conditioning (AC)" },
      { icon: Tv, name: "Flat Screen TV" },
      { icon: Bed, name: "Comfortable Double Bed" },
      { icon: ShowerHead, name: "Attached Bath & Hot Water" },
    ],
    faqs: [
      { q: "Is parking safe?", a: "Yes, we have 24/7 guarded CCTV-monitored parking space for cars and bikes free of charge." },
      { q: "Are pets allowed?", a: "Pets are generally not allowed. Please contact our reception to discuss special requests." }
    ]
  },
  "non-ac-deluxe": {
    name: "Non-Ac Deluxe",
    price: "₹999",
    image: "/images/non-ac-deluxe-room.jpeg",
    description: "Experience luxury with a dedicated seating area and refined decor.",
    longDescription: "Designed for budget-conscious travelers, our Non-Ac Deluxe Room offers comfortable lodging at an unbeatable price point. It features a spacious layout with a double bed, clean sheets, and a clean attached bathroom. A ceiling fan provides cooling, and the room includes a desk and seating area. Guests enjoy all general hotel benefits including safe parking and free high-speed Wi-Fi.",
    maxGuests: "2 Guests",
    bedType: "1 Double Bed",
    bathType: "Clean Bathroom",
    amenities: [
      { icon: Wifi, name: "Free High-Speed Wi-Fi" },
      { icon: Bed, name: "Comfortable Double Bed" },
      { icon: ShowerHead, name: "Attached Private Bath" },
      { icon: Coffee, name: "Ceiling Fan Cooling" },
    ],
    faqs: [
      { q: "Is hot water available in non-AC rooms?", a: "Yes, bucket hot water is provided on request during morning hours." },
      { q: "Can we upgrade to AC room on arrival?", a: "Subject to availability, you can upgrade by paying the difference at the reception desk." }
    ]
  }
};
