export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-heading text-gold mb-4">Krishna Hotel</h3>
                        <p className="text-gray-300 mb-4">
                            Affordable luxury stay on the Ayodhya Highway. Comfort, cleanliness, and budget-friendly pricing for families and travelers.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#rooms" className="hover:text-gold transition">Rooms</a></li>
                            <li><a href="#amenities" className="hover:text-gold transition">Amenities</a></li>
                            <li><a href="#gallery" className="hover:text-gold transition">Gallery</a></li>
                            <li><a href="#reviews" className="hover:text-gold transition">Reviews</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-heading mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-gray-300">
                            <li>📍 Ayodhya-Akbarpur Route,Near Fire Station Ambedkar Nagar 224122</li>
                            <li>📞 <a href="tel:+918604680149" className="hover:text-gold transition">+91 86046 80149</a></li>
                            <li>💬 <a href="https://wa.me/918604680149" className="hover:text-gold transition">WhatsApp Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Krishna Hotel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
