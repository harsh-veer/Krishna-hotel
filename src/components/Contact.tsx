"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Users, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Contact() {
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

    useEffect(() => {
        const handleRoomSelected = (e: Event) => {
            const customEvent = e as CustomEvent;
            setFormData(prev => ({
                ...prev,
                message: `I am interested in booking the ${customEvent.detail}.`
            }));
        };

        window.addEventListener('roomSelected', handleRoomSelected);
        return () => window.removeEventListener('roomSelected', handleRoomSelected);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            // If check-in changes and is on/after check-out, clear check-out
            if (name === 'checkIn' && updated.checkOut && value >= updated.checkOut) {
                updated.checkOut = '';
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                throw new Error(data.error || 'Failed to submit form');
            }

            toast.success('Booking Request Sent Successfully!', {
                duration: 5000,
                position: 'bottom-center',
            });
            
            setFormData({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "1", message: "" });
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
                                            placeholder="John Doe"
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
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-royal-blue focus:outline-none focus:ring-1 focus:ring-royal-blue bg-gray-50/50"
                                        placeholder="john@example.com"
                                    />
                                </div>

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
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-royal-blue px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-royal-blue-light transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Sending..." : "Send Booking Request"}</span>
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
