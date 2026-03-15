"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, Users, Send } from "lucide-react";

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

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send an API request to a backend
        console.log("Form Submitted:", formData);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 5000);
        setFormData({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "1", message: "" });
    };

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

                        {isSubmitted ? (
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                                <div className="inline-flex rounded-full bg-green-100 p-3 mb-4">
                                    <Send className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="text-lg font-bold mb-2">Request Sent Successfully!</h4>
                                <p className="text-sm">We have received your reservation request and will contact you shortly to confirm your booking.</p>
                            </div>
                        ) : (
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
                                    className="w-full rounded-lg bg-royal-blue px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-royal-blue-light transition-all flex items-center justify-center space-x-2"
                                >
                                    <span>Send Booking Request</span>
                                    <Send className="h-4 w-4" />
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-3">We will call you back to confirm availability and process the booking.</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
