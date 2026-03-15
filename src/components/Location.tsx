export default function Location() {
    return (
        <section id="location" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        Find Us on the Highway
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Conveniently located in Ambedkar Nagar on the main Ayodhya Road. Look out for the Fire Station landmark.
                    </p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-inner h-[500px]">
                        {/* Embedded Google Map iframe pointing to Akbarpur/Ambedkar Nagar */}
                        <iframe
                            src="https://maps.google.com/maps?q=Krishna+Hotel+Akbarpur+Ambedkar+Nagar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        ></iframe>
                    </div>

                    <div className="mt-8 flex flex-col items-center sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                        <a
                            href="https://www.google.com/maps/search/Krishna+Hotel+Akbarpur+Ambedkar+Nagar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md bg-royal-blue px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-royal-blue-light transition-all"
                        >
                            Get Google Map Directions
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
