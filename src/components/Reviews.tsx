import { Star } from "lucide-react";

export default function Reviews() {
    const reviews = [
        {
            id: 1,
            name: "Ramesh Tiwari",
            date: "2 weeks ago",
            rating: 5,
            text: "Excellent stay on our way to Ayodhya. The rooms were very clean, AC was working perfectly, and the staff was extremely polite. Highly recommended for families.",
            ownerResponse: "Thank you Ramesh Ji for your wonderful feedback. We are glad you had a comfortable stay. Hope to serving you again on your next trip to Ayodhya!",
        },
        {
            id: 2,
            name: "Saurabh Mishra",
            date: "1 month ago",
            rating: 5,
            text: "Best budget hotel I found in Akbarpur. Value for money is incredible. Free breakfast was delicious, and there was plenty of safe parking for my car.",
            ownerResponse: "Dear Saurabh, we appreciate your 5-star rating! Providing great value and safe parking to highway travelers is our top priority.",
        },
        {
            id: 3,
            name: "Pooja Verma",
            date: "3 months ago",
            rating: 4,
            text: "Good spacious rooms and clean bathrooms. We reached late at night but the staff was awake to help us check-in smoothly. Food quality could be slightly faster.",
            ownerResponse: "Hi Pooja, thank you for your review. We are happy our 24/7 reception helped you during late check-in. We are working on improving our room service speed.",
        }
    ];

    return (
        <section id="reviews" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="h-6 w-6 text-gold fill-gold" />)}
                    </div>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Loved by Highway Travelers
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Read what our recent guests have to say about their stay at Krishna Hotel.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-royal-blue/10 flex items-center justify-center font-bold text-royal-blue text-lg">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                                    <p className="text-sm text-gray-500">{review.date}</p>
                                </div>
                            </div>

                            <div className="flex mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating ? "text-gold fill-gold" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6 italic flex-grow">"{review.text}"</p>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center mb-2">
                                    <span className="text-xs font-bold text-royal-blue uppercase tracking-wider">Response from Owner</span>
                                </div>
                                <p className="text-sm text-gray-600">{review.ownerResponse}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
