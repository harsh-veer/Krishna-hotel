"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Bed, 
  Users, 
  ShowerHead, 
  ArrowLeft, 
  Send,
  Calendar,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { isValidIndianMobile, PHONE_ERROR, sanitizePhoneInput } from "@/lib/validation";
import { ROOMS_DATA } from "@/lib/rooms";
import EmailOtpField from "@/components/EmailOtpField";
import HouseRules from "@/components/HouseRules";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { bookingWhatsAppLink } from "@/lib/hotel";

export default function RoomDetail({ slug }: { slug: string }) {
  const room = ROOMS_DATA[slug];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [availability, setAvailability] = useState({
    checked: false,
    loading: false,
    available: false,
    remaining: 0,
    total: 0
  });

  useEffect(() => {
    if (!formData.checkIn || !formData.checkOut || !room) {
      setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
      return;
    }

    const checkAvailability = async () => {
      setAvailability((prev) => ({ ...prev, loading: true }));
      try {
        const query = new URLSearchParams({
          roomType: room.name,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut
        }).toString();
        const res = await fetch(`/api/bookings/check-availability?${query}`);
        if (res.ok) {
          const data = await res.json();
          setAvailability({
            checked: true,
            loading: false,
            available: data.available,
            remaining: data.remaining,
            total: data.total
          });
        }
      } catch (err) {
        console.error("Availability check error:", err);
      } finally {
        setAvailability((prev) => ({ ...prev, loading: false }));
      }
    };

    const timer = setTimeout(checkAvailability, 400);
    return () => clearTimeout(timer);
  }, [formData.checkIn, formData.checkOut, room]);

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Room Not Found</h1>
        <p className="text-gray-500">The room you are looking for does not exist.</p>
        <Link href="/" className="bg-royal-blue text-white px-5 py-2.5 rounded-lg font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const value = name === "phone" ? sanitizePhoneInput(e.target.value) : e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "checkIn" && updated.checkOut && value >= updated.checkOut) {
        updated.checkOut = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidIndianMobile(formData.phone)) {
      toast.error(PHONE_ERROR);
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email with the 6-digit code first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roomType: room.name,
          message: formData.message || `Booking request for ${room.name} via Room Detail page.`
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.needsVerification) setEmailVerified(false);
        throw new Error(data.error || "Failed to submit request.");
      }

      toast.success("Booking request sent successfully!", { duration: 5000 });
      setFormData({
        name: "",
        email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: "1",
        message: ""
      });
      setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
      setEmailVerified(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = formData.checkIn
    ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split("T")[0]
    : today;

  return (
    <div className="bg-gray-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link href="/#rooms" className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-500 hover:text-royal-blue transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Room Lists</span>
          </Link>
        </div>

        {/* Hero split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Room details: Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-96 sm:h-[450px]">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <h1 className="text-3xl font-bold font-heading">{room.name}</h1>
                  <p className="text-white/80 text-sm font-medium">{room.description}</p>
                </div>
              </div>

              {/* Specs bar */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-center py-5 bg-gray-50/30">
                <div>
                  <Users className="h-5 w-5 mx-auto text-royal-blue mb-1" />
                  <span className="block text-xs font-semibold text-gray-400">Capacity</span>
                  <span className="text-sm font-bold text-gray-800">{room.maxGuests}</span>
                </div>
                <div>
                  <Bed className="h-5 w-5 mx-auto text-royal-blue mb-1" />
                  <span className="block text-xs font-semibold text-gray-400">Bed Type</span>
                  <span className="text-sm font-bold text-gray-800">{room.bedType}</span>
                </div>
                <div>
                  <ShowerHead className="h-5 w-5 mx-auto text-royal-blue mb-1" />
                  <span className="block text-xs font-semibold text-gray-400">Bathroom</span>
                  <span className="text-sm font-bold text-gray-800">{room.bathType}</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Room Overview</h2>
                  <p className="text-gray-600 leading-relaxed text-sm">{room.longDescription}</p>
                </div>

                <hr className="border-gray-100" />

                {/* Premium Amenities list */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Premium Amenities Included</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {room.amenities.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="bg-white p-2 rounded-lg text-royal-blue border border-gray-100 shadow-xs">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Specific */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900 font-heading">Frequently Asked Questions</h2>
              <div className="space-y-4 divide-y divide-gray-100">
                {room.faqs.map((faq, index) => (
                  <div key={index} className={`pt-4 ${index === 0 ? 'pt-0' : ''}`}>
                    <h4 className="font-bold text-gray-950 text-sm flex items-start space-x-2">
                      <span className="text-gold">Q:</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-gray-600 text-xs mt-1.5 ml-5 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reservation Widget: Right Column */}
          <div id="contact" className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 space-y-6 sticky top-24 scroll-mt-24">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Price details</span>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-2xl font-bold text-royal-blue">{room.price}</span>
                <span className="text-xs text-gray-500 font-medium">per night (inclusive of taxes)</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-gray-900 text-sm font-heading">Reserve Room</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                />
              </div>

              <div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="tel"
                    maxLength={13}
                    placeholder="10-digit mobile"
                    className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                  />
                </div>
              </div>

              <EmailOtpField
                id="room-email"
                label="Email"
                email={formData.email}
                onEmailChange={(email) => setFormData((prev) => ({ ...prev, email }))}
                verified={emailVerified}
                onVerifiedChange={setEmailVerified}
                labelClassName="block text-xs font-semibold text-gray-500 mb-1"
                inputClassName="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                buttonClassName="shrink-0 rounded-lg bg-royal-blue px-3 text-xs font-semibold text-white hover:bg-royal-blue-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Check-in</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="checkIn"
                      required
                      min={today}
                      value={formData.checkIn}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 pl-8 pr-2 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                    />
                    <Calendar className="absolute left-2.5 top-3 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Check-out</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="checkOut"
                      required
                      min={minCheckOut}
                      value={formData.checkOut}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 pl-8 pr-2 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                    />
                    <Calendar className="absolute left-2.5 top-3 h-3.5 w-3.5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Guests</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-xs focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 appearance-none"
                >
                  {Array.from({ length: room.guestLimit }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>{n === 1 ? "1 Guest" : `${n} Guests`}</option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-gray-400">Up to {room.guestLimit} guests. More people? Book 2 rooms.</p>
              </div>

              {/* Availability checks */}
              {availability.loading && (
                <div className="text-[10px] text-royal-blue font-semibold flex items-center space-x-1.5 bg-royal-blue/5 p-2.5 rounded-lg border border-royal-blue/20">
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-royal-blue border-t-transparent" />
                  <span>Checking room availability...</span>
                </div>
              )}

              {!availability.loading && availability.checked && (
                <div className={`p-2.5 rounded-lg border text-[11px] ${
                  availability.available 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  <p className="font-semibold flex items-center space-x-1.5">
                    <span>
                      {availability.available 
                        ? `✅ Available: Only ${availability.remaining} of ${availability.total} rooms left!`
                        : `❌ Sold Out: No rooms available for these dates.`
                      }
                    </span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !emailVerified || (availability.checked && !availability.available)}
                className="w-full rounded-lg bg-royal-blue px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-royal-blue-light transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <span>{isLoading ? "Requesting..." : (availability.checked && !availability.available) ? "Sold Out" : !emailVerified ? "Verify Email to Continue" : "Send Stay Request"}</span>
                {!isLoading && <Send className="h-3.5 w-3.5" />}
              </button>
            </form>
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 font-semibold mt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-royal-blue" />
              <span>Safe & Secure Booking Confirmation</span>
            </div>

            <a
              href={bookingWhatsAppLink({ ...formData, roomType: room.name })}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-[#25D366] px-4 py-2.5 text-xs font-semibold text-[#128C4A] hover:bg-[#25D366]/10 transition-colors flex items-center justify-center gap-2"
            >
              <WhatsAppIcon />
              <span>Or book on WhatsApp</span>
            </a>

            <HouseRules compact />
          </div>

        </div>

      </div>
    </div>
  );
}
