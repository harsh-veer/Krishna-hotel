import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-royal-blue">
                        Krishna Hotel
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <Link href="#rooms" className="text-gray-700 hover:text-royal-blue-light font-medium transition-colors">Rooms</Link>
                    <Link href="#amenities" className="text-gray-700 hover:text-royal-blue-light font-medium transition-colors">Amenities</Link>
                    <Link href="#gallery" className="text-gray-700 hover:text-royal-blue-light font-medium transition-colors">Gallery</Link>
                    <Link href="#location" className="text-gray-700 hover:text-royal-blue-light font-medium transition-colors">Location</Link>
                    <a href="tel:+918604680149" className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors">
                        Book Now
                    </a>
                </div>

                {/* Mobile menu button (Implementation placeholder for state) */}
                <div className="flex md:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
