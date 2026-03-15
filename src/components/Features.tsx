import { MapPin, Sparkles, IndianRupee, ShieldCheck } from "lucide-react";

export default function Features() {
    const features = [
        {
            icon: <MapPin className="h-8 w-8 text-royal-blue" />,
            title: "Prime Highway Location",
            description: "Conveniently situated on the Ayodhya-Akbarpur route, making it the perfect pitstop for cross-city travelers.",
        },
        {
            icon: <Sparkles className="h-8 w-8 text-royal-blue" />,
            title: "Clean & Spacious Rooms",
            description: "Immaculate hygiene standards with daily cleaning and sanitization protocols for a refreshing stay.",
        },
        {
            icon: <IndianRupee className="h-8 w-8 text-royal-blue" />,
            title: "Budget Pricing",
            description: "Enjoy premium comfort and amenities without breaking the bank. Affordable luxury is our promise.",
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-royal-blue" />,
            title: "Safe for Families",
            description: "24/7 security, CCTV surveillance, and a family-friendly environment ensuring absolute peace of mind.",
        },
    ];

    return (
        <section id="amenities" className="py-20 bg-royal-blue/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="mb-4 inline-block rounded-full bg-royal-blue/10 px-3 py-1 text-sm font-semibold tracking-wider text-royal-blue uppercase">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Everything You Need for a Perfect Web Stay
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        From seamless check-ins to comfortable sleep, we prioritize the things that matter the most for highway travelers and families.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col rounded-2xl bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-royal-blue/10 mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-heading text-gray-900">{feature.title}</h3>
                            <p className="text-gray-600 flex-1 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
