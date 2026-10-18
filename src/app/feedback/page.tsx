"use client";

import { use, useState, useEffect } from "react";
import { Star, Award, CheckCircle, ArrowLeft, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface BookingDetails {
  name: string;
  roomType: string;
  status: string;
}

function FeedbackFormContent({ bookingId }: { bookingId: string | null }) {

  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    text: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Verify booking on load
  useEffect(() => {
    if (!bookingId) return;

    const verifyBooking = async () => {
      setIsVerifying(true);
      try {
        const res = await fetch(`/api/bookings/verify/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          setBookingDetails(data);
          setFormData((prev) => ({ ...prev, name: data.name }));
        } else {
          toast.error("Invalid review reference link. You can still submit a review manually.");
        }
      } catch (err) {
        console.error("Verification error:", err);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyBooking();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!formData.name.trim() || !formData.text.trim()) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          rating: formData.rating,
          text: formData.text,
          bookingId: bookingId || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      toast.success("Review submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 max-w-md mx-auto space-y-6">
        <div className="inline-flex items-center justify-center bg-green-50 p-4 rounded-full text-green-500 border border-green-200">
          <CheckCircle className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 font-heading">Thank You!</h2>
          <p className="text-gray-600">Your review was submitted for approval and will appear on our page soon.</p>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center space-x-2 bg-royal-blue text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-royal-blue-light transition-all text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden my-8">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-royal-blue/5 rounded-bl-full -z-10" />

      {/* Verified Tag */}
      {bookingDetails && (
        <div className="mb-4 inline-flex items-center space-x-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
          <Award className="h-3.5 w-3.5" />
          <span>Verified Guest stay ({bookingDetails.roomType})</span>
        </div>
      )}

      <div className="mb-8">
        <Link href="/" className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-400 hover:text-royal-blue transition-colors mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-2xl font-bold font-heading text-gray-900 sm:text-3xl">
          {bookingDetails ? `Rate Your Stay, ${bookingDetails.name.split(" ")[0]}!` : "Share Your Experience"}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Your feedback helps us maintain high hospitality standards and guides future highway travelers.
        </p>
      </div>

      {isVerifying ? (
        <div className="py-12 flex flex-col items-center space-y-3">
          <span className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-royal-blue border-t-transparent" />
          <span className="text-sm text-gray-500 font-medium">Verifying stay details...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star selector */}
          <div className="space-y-2 text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700">Your Overall Rating</label>
            <div className="flex items-center justify-center space-x-1.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || formData.rating)
                        ? "text-gold fill-gold"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1">
              {formData.rating === 5 && "Excellent stay! Loved it."}
              {formData.rating === 4 && "Very good stay! Minor room for improvement."}
              {formData.rating === 3 && "Average stay. Met expectations."}
              {formData.rating === 2 && "Poor stay. Needs focus."}
              {formData.rating === 1 && "Terrible stay. Unacceptable service."}
            </p>
          </div>

          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              required
              disabled={!!bookingDetails}
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Ramesh Tiwari"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Review Comments</label>
            <textarea
              id="text"
              required
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Tell us about the room comfort, cleanliness, AC cooling, food, or front-desk behavior..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-royal-blue px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-royal-blue-light transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isLoading ? "Submitting..." : "Submit Review"}</span>
            {!isLoading && <MessageSquare className="h-4 w-4" />}
          </button>
        </form>
      )}
    </div>
  );
}

// Reading bookingId from the page's searchParams (not useSearchParams) lets the form
// render on the server, so visitors and crawlers never see a stuck loading screen.
export default function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string | string[] }>;
}) {
  const { bookingId } = use(searchParams);
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <FeedbackFormContent bookingId={typeof bookingId === "string" ? bookingId : null} />
    </div>
  );
}
