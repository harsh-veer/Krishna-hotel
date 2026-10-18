"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Users, Send, BedDouble } from "lucide-react";
import toast from "react-hot-toast";
import EmailOtpField from "@/components/EmailOtpField";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        roomType: "Super-Deluxe Room",
        checkIn: "",
        checkOut: "",
        guests: "1",
        message: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [availability, setAvailability] = useState<{
        checked: boolean;
        loading: boolean;
        available: boolean;
        remaining: number;
        total: number;
    }>({
        checked: false,
        loading: false,
        available: false,
        remaining: 0,
        total: 0
    });

    useEffect(() => {
        const handleRoomSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            setFormData(prev => ({
                ...prev,
                roomType: customEvent.detail,
                message: prev.message || `I am interested in booking the ${customEvent.detail}.`
            }));
        };

        window.addEventListener('roomSelected', handleRoomSelected);
        return () => window.removeEventListener('roomSelected', handleRoomSelected);
    }, []);

    useEffect(() => {
        if (!formData.checkIn || !formData.checkOut || !formData.roomType) {
            setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
            return;
        }

        const checkAvailability = async () => {
            setAvailability(prev => ({ ...prev, loading: true }));
            try {
                const query = new URLSearchParams({
                    roomType: formData.roomType,
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
                } else {
                    setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
                }
            } catch (err) {
                console.error("Availability check failed:", err);
                setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
            }
        };

        const timer = setTimeout(checkAvailability, 400); // debounce
        return () => clearTimeout(timer);
    }, [formData.checkIn, formData.checkOut, formData.roomType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        if (name === "name") {
            sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
        } else if (name === "phone") {
            sanitizedValue = value.startsWith("+")
                ? "+" + value.slice(1).replace(/\D/g, "")
                : value.replace(/\D/g, "");
            if (sanitizedValue.length > 14) return;
        }

        setFormData(prev => {
            const updated = { ...prev, [name]: sanitizedValue };
            // If check-in changes and is on/after check-out, clear check-out
            if (name === 'checkIn' && updated.checkOut && sanitizedValue >= updated.checkOut) {
                updated.checkOut = '';
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailVerified) {
            toast.error('Please verify your email with the 6-digit code first.', {
                duration: 5000,
                position: 'bottom-center',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.needsVerification) setEmailVerified(false);
                throw new Error(data.error || 'Failed to submit form');
            }

            toast.success('Booking Request Sent Successfully!', {
                duration: 5000,
                position: 'bottom-center',
            });
            
            setFormData({ name: "", email: "", phone: "", roomType: "Super-Deluxe Room", checkIn: "", checkOut: "", guests: "1", message: "" });
            setEmailVerified(false);
            setAvailability({ checked: false, loading: false, available: false, remaining: 0, total: 0 });
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong. Please try again.', {
                duration: 5000,
                position: 'bottom-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const minCheckOut = formData.checkIn
        ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0]
        : today;

    return (
        <section id="contact" className="py-20 relative bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Contact Info */}
                    <div>
                        <span className="mb-4 inline-block rounded-full bg-royal-blue/10 px-3 py-1 text-sm font-semibold tracking-wider text-royal-blue uppercase">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl mb-6">
                            Ready to Book Your Stay?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Have questions or need to make a reservation? Fill out the form, or reach out to us directly via phone or email. Our 24/7 front desk is always ready to assist you.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-royal-blue/30 transition-colors">
                                <div className="bg-white p-3 rounded-full text-royal-blue shadow-sm">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Call Us Now</p>
                                    <a href="tel:+918604680149" className="text-lg font-bold text-gray-900 hover:text-royal-blue transition-colors">
                                        +91 86046 80149
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-royal-blue/30 transition-colors">
                                <div className="bg-white p-3 rounded-full text-royal-blue shadow-sm">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Email Us</p>
                                    <a href="mailto:krishnahotel10851@gmail.com" className="text-lg font-bold text-gray-900 hover:text-royal-blue transition-colors">
                                        krishnahotel10851@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-royal-blue/5 rounded-bl-full -z-10"></div>

                        <h3 className="text-2xl font-bold text-gray-900 font-heading mb-6">Reservation Request</h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                                            placeholder="Krishna Hotel"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                                            placeholder="+91 8604680149"
                                        />
                                    </div>
                                </div>
                                <EmailOtpField
                                    email={formData.email}
                                    onEmailChange={(email) => setFormData(prev => ({ ...prev, email }))}
                                    verified={emailVerified}
                                    onVerifiedChange={setEmailVerified}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="checkIn"
                                                name="checkIn"
                                                value={formData.checkIn}
                                                onChange={handleChange}
                                                required
                                                min={today}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                                            />
                                            <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                id="checkOut"
                                                name="checkOut"
                                                value={formData.checkOut}
                                                onChange={handleChange}
                                                required
                                                min={minCheckOut}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                                            />
                                            <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                        <div className="relative">
                                            <select
                                                id="roomType"
                                                name="roomType"
                                                value={formData.roomType}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 appearance-none"
                                            >
                                                <option value="Super-Deluxe Room">Super-Deluxe Room (₹1,500)</option>
                                                <option value="Standard Ac Room">Standard Ac Room (₹1,200)</option>
                                                <option value="Non-Ac Deluxe">Non-Ac Deluxe (₹999)</option>
                                            </select>
                                            <BedDouble className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                                        <div className="relative">
                                            <select
                                                id="guests"
                                                name="guests"
                                                value={formData.guests}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-300 pl-11 pr-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 appearance-none"
                                            >
                                                <option value="1">1 Person</option>
                                                <option value="2">2 People</option>
                                                <option value="3">3 People</option>
                                                <option value="4+">4+ People</option>
                                            </select>
                                            <Users className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {availability.loading && (
                                    <div className="text-xs text-royal-blue font-medium flex items-center space-x-2 bg-royal-blue/5 p-3 rounded-lg border border-royal-blue/20 animate-pulse">
                                        <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-royal-blue border-t-transparent"></span>
                                        <span>Checking availability for these dates...</span>
                                    </div>
                                )}

                                {!availability.loading && availability.checked && (
                                    <div className={`p-3 rounded-lg border text-sm ${
                                        availability.available 
                                            ? availability.remaining === 1 
                                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                                : 'bg-green-50 text-green-800 border-green-200'
                                            : 'bg-red-50 text-red-800 border-red-200'
                                    }`}>
                                        <p className="font-semibold flex items-center space-x-1.5">
                                            <span>
                                                {availability.available 
                                                    ? availability.remaining === 1
                                                        ? `⚠️ Only 1 room left for these dates!`
                                                        : `✅ Available: ${availability.remaining} of ${availability.total} rooms available.`
                                                    : `❌ Sold Out: No rooms available for these dates.`
                                                }
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50 resize-none"
                                        placeholder="Any special requests or questions..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !emailVerified || (availability.checked && !availability.available)}
                                    className="w-full rounded-lg bg-royal-blue px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-royal-blue-light transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
                                >
                                    <span>{isLoading ? "Sending..." : (availability.checked && !availability.available) ? "Sold Out for Selected Dates" : !emailVerified ? "Verify Email to Continue" : "Send Booking Request"}</span>
                                    {!isLoading && <Send className="h-4 w-4" />}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-3">We will call you back to confirm availability and process the booking.</p>
                            </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
