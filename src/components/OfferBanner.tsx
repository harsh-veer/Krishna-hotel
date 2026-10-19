"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Offer = { text: string; textHi: string; link: string };

// Strip at the very top of the site for a current offer. The hotel turns it on and edits it in /admin → Settings.
export default function OfferBanner() {
    const [offer, setOffer] = useState<Offer | null>(null);
    const [hidden, setHidden] = useState(false);
    const [hindi, setHindi] = useState(false);

    useEffect(() => {
        fetch("/api/settings")
            .then((r) => r.json())
            .then((d) => {
                if (!d.offer) return;
                try {
                    if (sessionStorage.getItem("offer-closed") === d.offer.text) setHidden(true);
                } catch {}
                setOffer(d.offer);
            })
            .catch(() => {});

        // Follow the site's language switch, which sets <html lang>.
        const update = () => setHindi(document.documentElement.lang === "hi");
        update();
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
        return () => observer.disconnect();
    }, []);

    if (!offer || hidden) return null;

    const text = hindi && offer.textHi ? offer.textHi : offer.text;
    const close = () => {
        setHidden(true);
        try { sessionStorage.setItem("offer-closed", offer.text); } catch {}
    };

    return (
        <div className="relative bg-gold text-royal-blue text-center text-sm font-semibold px-10 py-2">
            {offer.link ? (
                <a href={offer.link} className="underline-offset-2 hover:underline">
                    {text} <span aria-hidden>→</span>
                </a>
            ) : (
                <span>{text}</span>
            )}
            <button
                onClick={close}
                aria-label="Close offer"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
