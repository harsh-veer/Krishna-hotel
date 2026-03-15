import { CheckCircle2, Star, Coffee, Wifi, Car, Shield } from "lucide-react";

export default function About() {
    const highlights = [
        { icon: <CheckCircle2 className="h-5 w-5 text-gold" />, text: "Spacious AC Rooms" },
        { icon: <Coffee className="h-5 w-5 text-gold" />, text: "Breakfast" },
        { icon: <Car className="h-5 w-5 text-gold" />, text: "Ample Free Parking" },
        { icon: <Shield className="h-5 w-5 text-gold" />, text: "Family Friendly & Safe" },
        { icon: <Wifi className="h-5 w-5 text-gold" />, text: "High-Speed WiFi" },
        { icon: <Star className="h-5 w-5 text-gold" />, text: "24/7 Room Service" },
    ];

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">

                    {/* Images Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src="/images/RUID782b578fd9e64411aedb00e919509b29.jpg"
                            alt="Hotel Reception"
                            className="rounded-2xl shadow-lg object-cover h-64 w-full"
                        />
                        <img
                            src="/images/RUID4542dd11e494471dab89a44c7c8115a3.jpg"
                            alt="Hotel Room Detail"
                            className="rounded-2xl shadow-lg object-cover h-64 w-full mt-8"
                        />
                    </div>

                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-medium text-yellow-800 mb-6">
                            <Star className="h-4 w-4 fill-gold text-gold" />
                            <span>180+ Google Reviews (3.8 Rating)</span>
                        </div>

                        <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl mb-6">
                            Your Home Away From Home on Ayodhya Highway
                        </h2>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Located perfectly on the Ayodhya-Akbarpur route, Krishna Hotel is the ideal stopover for pilgrims, highway travelers, and families. We pride ourselves on offering luxurious comfort without the premium price tag.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                            {highlights.map((item, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm">{item.icon}</div>
                                    <span className="text-gray-700 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <a
                                href="#rooms"
                                className="text-royal-blue font-semibold hover:text-royal-blue-light flex items-center group transition-colors"
                            >
                                Explore our rooms
                                <span className="ml-2 group-hover:translate-x-1 duration-200 transition-transform">→</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
