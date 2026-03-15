"use client";

import { useState } from "react";
import { Maximize2, X } from "lucide-react";

export default function Gallery() {
    const images = [
        { src: "/images/RUID782b578fd9e64411aedb00e919509b29.jpg", alt: "Restaurant View", category: "Restaurant" },
        { src: "/images/RUID4542dd11e494471dab89a44c7c8115a3.jpg", alt: "Hotel Front View", category: "Hotel" },
        { src: "/images/RUID6be30bebb9614ed3a6ae2bfdf8886bb5.jpg", alt: "Standard AC Room", category: "Rooms" },
        { src: "/images/RUID0ab0ad48ea4f4b1db907503b22e4fafd.jpg", alt: "Super-Deluxe Room", category: "Rooms" },
        { src: "/images/RUID40c03feb9f014035bf1be488172cda98.jpg", alt: "Non-AC Deluxe", category: "Rooms" },
        { src: "/images/RUIDa738a21b1b51410a8ba1d07dc23b9c38.jpg", alt: "Restaurant View", category: "Restaurant" },
        { src: "/images/RUIDd266a089fa97483aa346a2e6a3a46fcb.jpg", alt: "Banquet Hall", category: "Banquet" },
        { src: "/images/RUID5bcf51637f024bd390fb78b2fb6a1e27.jpg", alt: "Banquet Hall - Aisle", category: "Banquet" },
        { src: "/images/RUID5bd1c0b308b34ac99a31618a845f45c2.jpg", alt: "Banquet Hall - Seating", category: "Banquet" },
        { src: "/images/RUIDaef4c68052bf42948a7c1d26a326863e.jpg", alt: "Banquet Hall - Stage Decor", category: "Banquet" },
        { src: "/images/RUIDf543e3ad42f7428da4ce7bd705423758.jpg", alt: "Banquet Hall - Full View", category: "Banquet" },
        { src: "/images/hotel-breakfast.jpg", alt: "Hotel Breakfast", category: "Food" },
        { src: "/images/hotel-brunch.webp", alt: "Hotel Brunch", category: "Food" }
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section id="gallery" className="py-20 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="mb-4 inline-block rounded-full bg-royal-blue/10 px-3 py-1 text-sm font-semibold tracking-wider text-royal-blue uppercase">
                        Our Gallery
                    </span>
                    <h2 className="text-3xl font-bold font-heading text-gray-900 sm:text-4xl">
                        A Glimpse of Your Stay
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Take a look at our rooms, reception area, and well-maintained facilities designed for your comfort.
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((image, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-2xl break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedImage(image.src)}>
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Maximize2 className="text-white h-8 w-8" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                                <span className="text-sm font-semibold uppercase tracking-wider text-gold">{image.category}</span>
                                <p className="font-medium mt-1">{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4" onClick={() => setSelectedImage(null)}>
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gold transition-colors p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Enlarged view"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}
