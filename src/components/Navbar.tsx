"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/logo-transparent.png"
                            alt="Krishna Hotel Logo"
                            width={44}
                            height={44}
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                        <span className="text-2xl font-bold text-royal-blue tracking-tight">
                            Krishna Hotel
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <Link href="/#rooms" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">Rooms</Link>
                    <Link href="/#amenities" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">Amenities</Link>
                    <Link href="/#gallery" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">Gallery</Link>
                    <Link href="/#location" className="text-gray-700 hover:text-royal-blue font-medium transition-colors">Location</Link>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center space-x-1.5 text-gray-700 hover:text-royal-blue font-medium transition-colors"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>Reviews</span>
                    </Link>

                    {/* Book Now Button */}
                    <Link href="/#contact" className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors">
                        Book Now
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        {mobileOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-md">
                    <Link href="/#rooms" onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">Rooms</Link>
                    <Link href="/#amenities" onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">Amenities</Link>
                    <Link href="/#gallery" onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">Gallery</Link>
                    <Link href="/#location" onClick={() => setMobileOpen(false)} className="block text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">Location</Link>
                    <Link href="/feedback" onClick={() => setMobileOpen(false)} className="flex items-center space-x-1.5 text-gray-700 hover:text-royal-blue font-medium py-2 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>Leave a Review</span>
                    </Link>

                    <Link href="/#contact" onClick={() => setMobileOpen(false)} className="block w-full text-center rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-light transition-colors">
                        Book Now
                    </Link>
                </div>
            )}
        </nav>
    );
}
