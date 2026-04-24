"use client";

import { CalendarRange } from "lucide-react";

export default function MobileBookingBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
            <a
                href="#contact"
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-royal-blue px-4 py-3.5 text-base font-bold text-white shadow-sm hover:bg-royal-blue-light transition-colors"
            >
                <CalendarRange className="h-5 w-5" />
                <span>Book Now</span>
            </a>
        </div>
    );
}
