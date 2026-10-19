import { NextResponse } from "next/server";

const HOTEL_KNOWLEDGE_BASE = {
  name: "Krishna Hotel & Restaurant",
  location: "Ayodhya-Akbarpur Route, Near Fire Station, Ambedkar Nagar, UP - 224122",
  phone: "+91 86046 80149",
  whatsapp: "https://wa.me/918604680149",
  ayodhyaDistance: "Approximately 45-50 minutes drive on the direct Ayodhya Highway.",
  priceRange: "₹999 - ₹1,500 per night",
  checkInTime: "12:00 PM (24/7 Front Desk)",

  whyPreferUs: [
    {
      title: "📍 Strategic Ayodhya Highway Location",
      desc: "Located directly on the Ayodhya-Akbarpur Road near Fire Station. Convenient stop for pilgrims visiting Ayodhya Ram Mandir, family travelers, and road trips."
    },
    {
      title: "✨ Unmatched Cleanliness & Hygiene",
      desc: "Spotless AC & Non-AC rooms, fresh sanitized linen, clean modern bathrooms, and daily housekeeping."
    },
    {
      title: "💰 Budget-Friendly Luxury",
      desc: "Enjoy comfortable AC rooms starting at just ₹999 to ₹1,500/night with zero hidden charges."
    },
    {
      title: "🍽️ Pure Veg In-House Krishna Restaurant",
      desc: "Delicious North Indian dishes, thali, snacks, complimentary breakfast spread, and 24/7 room service."
    },
    {
      title: "🎉 Grand Banquet & Party Hall",
      desc: "Spacious event venue with custom stage decor, balloon arrangements, red carpet, and seating for birthdays, weddings, and family functions."
    },
    {
      title: "🤝 24/7 Warm Hospitality",
      desc: "Helpful staff, instant check-in, secure free parking, 24/7 power backup, CCTV security, and instant WhatsApp booking."
    }
  ],

  facilities: [
    "❄️ Fully Air-Conditioned (AC) & Non-AC Rooms",
    "📶 High-Speed Free Wi-Fi across all rooms & restaurant",
    "🍽️ Pure Vegetarian Krishna Restaurant & Dining Hall",
    "🛎️ 24/7 Room Service & Front Desk Assistance",
    "☕ Complimentary Fresh Morning Breakfast",
    "🚿 24/7 Running Hot & Cold Water",
    "🎉 Grand Banquet & Event Hall with Stage Decor",
    "🚗 Free Secure Parking Area for Cars & Bikes",
    "⚡ 24/7 Power Backup (Generator Supported)",
    "🔒 CCTV Surveillance & 24/7 Security"
  ],

  roomTypes: [
    {
      name: "Non-Ac Deluxe",
      price: "₹999 / night",
      features: "1 Double Bed, 2 Guests, attached bathroom, ceiling fan, desk & seating, free Wi-Fi, safe parking."
    },
    {
      name: "Standard Ac Room",
      price: "₹1,200 / night (Most Popular)",
      features: "1 Double Bed, 2 Guests, Split AC, Flat TV, attached bath with geyser (24/7 hot water), free Wi-Fi."
    },
    {
      name: "Super-Deluxe Room",
      price: "₹1,500 / night",
      features: "1 Queen Bed, 2-3 Guests, High-power Split AC, Premium Bath with geyser (24/7 hot water), 32\" Smart LED TV, seating lounge, free Wi-Fi."
    }
  ]
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Please type a message to ask about Krishna Hotel." },
        { status: 400 }
      );
    }

    const q = message.toLowerCase().trim();

    // 1. Why Choose Us / Why Prefer Us
    if (
      q.includes("why choose") ||
      q.includes("why prefer") ||
      q.includes("why stay") ||
      q.includes("special") ||
      q.includes("advantage") ||
      q.includes("best hotel") ||
      q.includes("feature")
    ) {
      const preferList = HOTEL_KNOWLEDGE_BASE.whyPreferUs
        .map((item) => `• **${item.title}**: ${item.desc}`)
        .join("\n\n");

      return NextResponse.json({
        reply: `🌟 **Why Guests Prefer Krishna Hotel:**\n\n${preferList}\n\n📞 **Book your stay now:** Call [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149) or message on [WhatsApp](${HOTEL_KNOWLEDGE_BASE.whatsapp})!`
      });
    }

    // 2. Facilities & Amenities
    if (
      q.includes("facility") ||
      q.includes("facilities") ||
      q.includes("amenity") ||
      q.includes("amenities") ||
      q.includes("service") ||
      q.includes("services") ||
      q.includes("offer") ||
      q.includes("wifi") ||
      q.includes("parking") ||
      q.includes("hot water")
    ) {
      const facilityList = HOTEL_KNOWLEDGE_BASE.facilities.join("\n");
      return NextResponse.json({
        reply: `🏨 **Krishna Hotel Facilities & Amenities:**\n\n${facilityList}\n\nNeed assistance with a booking or special event? Call us anytime at [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149)!`
      });
    }

    // 3. Rooms & Pricing (Exact Website Rates)
    if (
      q.includes("room") ||
      q.includes("rooms") ||
      q.includes("price") ||
      q.includes("rate") ||
      q.includes("cost") ||
      q.includes("tariff") ||
      q.includes("rent") ||
      q.includes("deluxe") ||
      q.includes("ac")
    ) {
      const roomDetails = HOTEL_KNOWLEDGE_BASE.roomTypes
        .map((r) => `• **${r.name}** (${r.price}): ${r.features}`)
        .join("\n\n");

      return NextResponse.json({
        reply: `🛏️ **Room Categories & Rates at Krishna Hotel:**\n\n${roomDetails}\n\n✨ All rooms include free high-speed Wi-Fi and room service. AC rooms have a geyser for 24/7 hot water.\n\n📲 **Reserve a room now:** [Book via WhatsApp](${HOTEL_KNOWLEDGE_BASE.whatsapp}) or Call [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149).`
      });
    }

    // 4. Food & Dining / Restaurant
    if (
      q.includes("food") ||
      q.includes("dining") ||
      q.includes("restaurant") ||
      q.includes("breakfast") ||
      q.includes("eat") ||
      q.includes("veg") ||
      q.includes("menu") ||
      q.includes("paneer")
    ) {
      return NextResponse.json({
        reply: `🍽️ **Krishna Restaurant & Dining:**\n\n• **100% Pure Vegetarian** North Indian dishes, thali, snacks, and tea.\n• **In-house Restaurant**: Ambient dining hall with LED lighting & comfortable seating.\n• **24/7 Room Service**: Hot meals served straight to your bed.\n• **Free Morning Breakfast** included with stay packages.\n\nCraving delicious food? Call our front desk at [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149)!`
      });
    }

    // 5. Ayodhya & Location / Ram Mandir
    if (
      q.includes("ayodhya") ||
      q.includes("location") ||
      q.includes("ram mandir") ||
      q.includes("address") ||
      q.includes("where") ||
      q.includes("distance") ||
      q.includes("map") ||
      q.includes("route")
    ) {
      return NextResponse.json({
        reply: `📍 **Location & Ayodhya Distance:**\n\n• **Address**: ${HOTEL_KNOWLEDGE_BASE.location}\n• **Ayodhya Ram Mandir Distance**: ${HOTEL_KNOWLEDGE_BASE.ayodhyaDistance}\n• **Landmark**: Near Fire Station on the main Ayodhya-Akbarpur highway.\n\n🚗 Perfect, peaceful stopover for Ayodhya Ram Mandir devotees!\n\n👉 Need route directions? [Open WhatsApp Chat](${HOTEL_KNOWLEDGE_BASE.whatsapp})`
      });
    }

    // 6. Banquet Hall / Events / Birthday / Wedding
    if (
      q.includes("banquet") ||
      q.includes("event") ||
      q.includes("party") ||
      q.includes("wedding") ||
      q.includes("birthday") ||
      q.includes("hall") ||
      q.includes("stage") ||
      q.includes("decor")
    ) {
      return NextResponse.json({
        reply: `🎉 **Grand Banquet & Event Hall:**\n\n• **Capacity**: Ideal for birthday parties, ring ceremonies, family functions, anniversaries, and corporate meetings.\n• **Custom Decor**: Beautiful stage setups, balloon arches, red carpet, and seating.\n• **Catering & Sound**: In-house pure veg catering and sound arrangements.\n\n📞 **For Event & Banquet Hall Enquiries:** Call [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149).`
      });
    }

    // 7. Booking / Reservation / Contact
    if (
      q.includes("book") ||
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("call") ||
      q.includes("number") ||
      q.includes("whatsapp") ||
      q.includes("reserve")
    ) {
      return NextResponse.json({
        reply: `📞 **How to Book Your Stay at Krishna Hotel:**\n\n1. **Direct Phone Booking**: Call [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149) (24/7 Available)\n2. **WhatsApp Booking**: [Message us on WhatsApp](${HOTEL_KNOWLEDGE_BASE.whatsapp}) for instant room confirmation.\n3. **Walk-in Check-in**: Visit us anytime on Ayodhya-Akbarpur Road, near Fire Station.`
      });
    }

    // Default Friendly Response
    return NextResponse.json({
      reply: `Namaste! 🙏 Welcome to **Krishna Hotel & Restaurant**.\n\nI can help you with:\n\n• 🌟 **Why Customers Prefer Us**\n• 🏨 **Hotel Facilities & Amenities**\n• 🛏️ **Room Categories & Rates (₹999 - ₹1,500)**\n• 📍 **Ayodhya Ram Mandir Distance & Location**\n• 🍽️ **Pure Veg Krishna Restaurant**\n• 🎉 **Banquet & Event Hall Booking**\n\nHow may I assist you today? You can also call us directly at [${HOTEL_KNOWLEDGE_BASE.phone}](tel:+918604680149).`
    });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, I am having trouble processing that right now. Please call us directly at +91 86046 80149!" },
      { status: 500 }
    );
  }
}
