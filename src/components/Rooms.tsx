import { Users, BedDouble, Bath, Tv } from "lucide-react";

export default function Rooms() {
    const rooms = [
        {
            id: 1,
            name: "Standard AC Room",
            price: "₹1,500",
            image: "/images/RUID6be30bebb9614ed3a6ae2bfdf8886bb5.jpg",
            description: "Cozy and budget-friendly room perfect for solo travelers or couples.",
            features: [
                { icon: <BedDouble className="h-4 w-4" />, text: "1 Queen Bed" },
                { icon: <Users className="h-4 w-4" />, text: "2-3 Guests" },
                { icon: <Bath className="h-4 w-4" />, text: "Premium Bath" },
                { icon: <Tv className="h-4 w-4" />, text: "Flat TV" },
            ],
        },
        {
            id: 2,
            name: "Super-Deluxe  Room",
            price: "₹1,200",
            image: "/images/RUID0ab0ad48ea4f4b1db907503b22e4fafd.jpg",
            description: "Spacious enough for the whole family with extra bedding and premium amenities.",
            features: [
                { icon: <BedDouble className="h-4 w-4" />, text: "1 Double Bed" },
                { icon: <Users className="h-4 w-4" />, text: "2 Guests" },
                { icon: <Bath className="h-4 w-4" />, text: "Attached Bath" },
                { icon: <Tv className="h-4 w-4" />, text: "Flat TV" },
            ],
            popular: true,
        },
        {
            id: 3,
            name: "Non-Ac Deluxe",
            price: "₹999",
            image: "/images/RUID40c03feb9f014035bf1be488172cda98.jpg",
            description: "Experience luxury with a dedicated seating area and refined decor.",
            features: [
                { icon: <BedDouble className="h-4 w-4" />, text: "1 Double Bed" },
                { icon: <Users className="h-4 w-4" />, text: "2 Guests" },
                { icon: <Bath className="h-4 w-4" />, text: "Bathroom" },

            ],
        }
    ];

    return (
        <section id="rooms" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Comfortable Stays for Every Budget
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        All our rooms are fully air-conditioned, feature daily housekeeping, and include complimentary Wi-Fi to keep you connected.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <div key={room.id} className="group flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                {room.popular && (
                                    <div className="absolute top-4 right-4 z-10 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </div>
                                )}
                                <img
                                    src={room.image}
                                    alt={room.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 font-heading">{room.name}</h3>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-royal-blue">{room.price}</span>
                                        <span className="text-xs text-gray-500">per night</span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-6 flex-1">{room.description}</p>

                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 border-t border-gray-100 pt-4">
                                    {room.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center text-sm text-gray-600 space-x-2">
                                            <span className="text-gray-400">{feature.icon}</span>
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="tel:+918604680149"
                                    className="block w-full text-center rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-royal-blue hover:text-white hover:border-royal-blue transition-colors duration-200"
                                >
                                    Book This Room
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
