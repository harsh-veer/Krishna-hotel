import { MapPin, Sparkles, IndianRupee, ShieldCheck, Utensils, PartyPopper } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <MapPin className="h-8 w-8 text-royal-blue" />,
            title: "Strategic Ayodhya Highway Location",
            description: "Directly located on the Ayodhya-Akbarpur Road near Fire Station. Perfect stop for Ayodhya Ram Mandir pilgrims & family road trips.",
            badge: "Prime Location"
        },
        {
            icon: <Sparkles className="h-8 w-8 text-gold" />,
            title: "Unmatched Cleanliness & Hygiene",
            description: "Spotless AC rooms, fresh sanitized linen, clean modern bathrooms, and daily housekeeping for a refreshing stay.",
            badge: "100% Sanitized"
        },
        {
            icon: <IndianRupee className="h-8 w-8 text-green-600" />,
            title: "Budget-Friendly Luxury",
            description: "Enjoy premium AC comfort, high-speed Wi-Fi, and top-tier amenities at transparent prices starting from ₹999 - ₹1,500/night.",
            badge: "Best Value"
        },
        {
            icon: <Utensils className="h-8 w-8 text-amber-600" />,
            title: "Pure Veg Krishna Restaurant",
            description: "In-house restaurant serving delicious North Indian dishes, thali, snacks, and 24/7 hot room service straight to your room.",
            badge: "Pure Vegetarian"
        },
        {
            icon: <PartyPopper className="h-8 w-8 text-purple-600" />,
            title: "Grand Banquet & Event Hall",
            description: "Spacious venue with custom stage decorations, balloon arches, and seating for birthdays, weddings, and family events.",
            badge: "Event Space"
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
            title: "24/7 Security & Hospitality",
            description: "24/7 front desk, power backup generator, CCTV security, free parking, and warm family-friendly hospitality.",
            badge: "Safe Stay"
        },
    ];

    return (
        <section id="amenities" className="py-20 bg-gradient-to-b from-royal-blue/5 to-white relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="mb-4 inline-block rounded-full bg-gold/20 px-4 py-1.5 text-xs font-bold tracking-wider text-yellow-900 uppercase shadow-sm">
                        Why Customers Prefer Us
                    </span>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        The Krishna Hotel Advantage
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Discover why road travelers, families, and Ayodhya Ram Mandir pilgrims consistently rank Krishna Hotel as their top choice.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 group-hover:bg-royal-blue/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-royal-blue group-hover:text-white transition-colors">
                                    {feature.badge}
                                </span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-heading text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
