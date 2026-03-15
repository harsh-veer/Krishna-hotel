import { Coffee, Utensils, Clock, CheckCircle2 } from "lucide-react";

export default function Dining() {
    const highlights = [
        "Fresh, locally-sourced ingredients",
        "Pure vegetarian options available",
        "Customizable spice levels",
        "Special kids menu",
    ];

    return (
        <section id="dining" className="py-20 bg-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-royal-blue/5 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl"></div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Content Section */}
                    <div className="order-2 lg:order-1">
                        <span className="mb-4 inline-block rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold tracking-wider text-yellow-800 uppercase">
                            Dining & Room Service
                        </span>
                        <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl mb-6">
                            Delicious Meals, Served Fresh
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Whether you're starting your day with a hearty breakfast or craving a late-night snack, our kitchen is ready to serve you. Enjoy a variety of North Indian staples, light refreshments, and hot beverages prepared with care and hygiene.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-full text-royal-blue shadow-sm shrink-0">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">24/7 Room Service</h4>
                                    <p className="text-sm text-gray-600 mt-1">Enjoy hot meals delivered straight to your room anytime.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-white p-3 rounded-full text-royal-blue shadow-sm shrink-0">
                                    <Coffee className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Complimentary Breakfast</h4>
                                    <p className="text-sm text-gray-600 mt-1">Start your day right with our freshly prepared morning spread.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                                <Utensils className="h-5 w-5 mr-2 text-gold" />
                                Highlights
                            </h4>
                            <ul className="space-y-3">
                                {highlights.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-gray-700 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="order-1 lg:order-2 relative">
                        {/* We use a placeholder image URL for the food/dining or reuse a nice room interior if food is unavailable. For now, we will use a high quality unsplash food image. */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                            <img
                                src="/images/hotel-breakfast.jpg"
                                alt="Delicious Indian Food"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-white text-lg font-medium">Authentic flavors crafted for your journey.</p>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-4 hidden md:flex animate-bounce-slow">
                            <div className="bg-green-100 p-3 rounded-full">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Dietary Options</p>
                                <p className="text-md font-bold text-gray-900">100% Veg Available</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
