"use client";

import { Star, MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEWS_URL } from "@/lib/hotel";

interface Review {
    _id: string;
    name: string;
    rating: number;
    text: string;
    ownerResponse?: string;
    createdAt: string;
}

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
                    setReviews((data.reviews || []).slice(0, 6));
                }
            } catch {
                // Leave the list empty; the Google rating and link still show.
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section id="reviews" className="py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="flex justify-center mb-3">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} className={`h-6 w-6 ${i < Math.round(GOOGLE_RATING) ? "text-gold fill-gold" : "text-gray-300"}`} />
                        ))}
                    </div>
                    <p className="text-4xl font-bold text-gray-900 mb-1">{GOOGLE_RATING.toFixed(1)}</p>
                    <p className="text-sm text-gray-500 mb-4">
                        from {GOOGLE_REVIEW_COUNT}+ reviews on{" "}
                        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-royal-blue hover:underline">Google</a>
                    </p>
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
                ) : reviews.length > 0 && (
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
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href={GOOGLE_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 border border-royal-blue text-royal-blue font-bold px-6 py-3 rounded-lg hover:bg-royal-blue/5 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4" />
                        <span>Read all reviews on Google</span>
                    </a>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center space-x-2 bg-royal-blue text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-royal-blue/90 transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Leave a Review</span>
                    </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
