"use client";

import { Star, MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Review {
    _id: string;
    name: string;
    rating: number;
    text: string;
    ownerResponse?: string;
    createdAt: string;
}

// Hardcoded fallback reviews to show while loading or if DB has none yet
const FALLBACK_REVIEWS: Review[] = [
    {
        _id: "fallback-1",
        name: "Ramesh Tiwari",
        rating: 5,
        text: "Excellent stay on our way to Ayodhya. The rooms were very clean, AC was working perfectly, and the staff was extremely polite. Highly recommended for families.",
        ownerResponse: "Thank you Ramesh Ji for your wonderful feedback. We are glad you had a comfortable stay. Hope to serving you again on your next trip to Ayodhya!",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: "fallback-2",
        name: "Saurabh Mishra",
        rating: 5,
        text: "Best budget hotel I found in Akbarpur. Value for money is incredible. Free breakfast was delicious, and there was plenty of safe parking for my car.",
        ownerResponse: "Dear Saurabh, we appreciate your 5-star rating! Providing great value and safe parking to highway travelers is our top priority.",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: "fallback-3",
        name: "Pooja Verma",
        rating: 4,
        text: "Good spacious rooms and clean bathrooms. We reached late at night but the staff was awake to help us check-in smoothly. Food quality could be slightly faster.",
        ownerResponse: "Hi Pooja, thank you for your review. We are happy our 24/7 reception helped you during late check-in. We are working on improving our room service speed.",
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
    if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
};

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch("/api/reviews");
                if (res.ok) {
                    const data = await res.json();
                    // Use DB reviews if available, otherwise fall back to hardcoded
                    if (data.reviews && data.reviews.length > 0) {
                        setReviews(data.reviews.slice(0, 6));
                    } else {
                        setReviews(FALLBACK_REVIEWS);
                    }
                } else {
                    setReviews(FALLBACK_REVIEWS);
                }
            } catch {
                setReviews(FALLBACK_REVIEWS);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <section id="reviews" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex justify-center mb-3">
                        {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="h-6 w-6 text-gold fill-gold" />)}
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{averageRating}</p>
                    <p className="text-sm text-gray-500 mb-4">Average guest rating</p>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Loved by Highway Travelers
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Read what our recent guests have to say about their stay at Krishna Hotel.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="h-8 w-8 text-royal-blue animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <div key={review._id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-royal-blue/10 flex items-center justify-center font-bold text-royal-blue text-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{review.name}</h3>
                                        <p className="text-sm text-gray-500">{timeAgo(review.createdAt)}</p>
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

                                {review.ownerResponse && (
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center mb-2">
                                            <span className="text-xs font-bold text-royal-blue uppercase tracking-wider">Response from Owner</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{review.ownerResponse}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA to leave a review */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Stayed with us? We'd love to hear your feedback!</p>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center space-x-2 bg-royal-blue text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-royal-blue/90 transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Leave a Review</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
