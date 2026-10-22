"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

// Site language. Pages under /hi (/hi, /hi/rooms/[slug]) are Hindi on the server and the client,
// so Google indexes them in Hindi. Every other page renders English on the server; there a saved
// choice from localStorage can still switch the text to Hindi on the client after mount.
export type Lang = "en" | "hi";

export const HI_PREFIX = "/hi";

export const isHindiPath = (pathname: string | null | undefined) =>
    !!pathname && (pathname === HI_PREFIX || pathname.startsWith(`${HI_PREFIX}/`));

// English pages that have a Hindi twin: the home page and the room pages.
const hasHindiTwin = (path: string) => path === "/" || /^\/rooms\/[^/]+$/.test(path);

// The Hindi URL for an English path ("/" -> "/hi", "/rooms/x" -> "/hi/rooms/x"), or null if none.
export function toHindiPath(path: string): string | null {
    if (isHindiPath(path)) return path;
    if (!hasHindiTwin(path)) return null;
    return path === "/" ? HI_PREFIX : `${HI_PREFIX}${path}`;
}

// The English URL for a /hi path ("/hi" -> "/", "/hi/rooms/x" -> "/rooms/x").
export function toEnglishPath(path: string): string {
    if (!isHindiPath(path)) return path;
    return path.slice(HI_PREFIX.length) || "/";
}

// Rewrites an internal link ("/", "/#rooms", "/rooms/x") to its /hi twin when `hindi` is true.
// Links without a Hindi twin (e.g. /feedback) and plain hash links ("#contact") are left alone.
export function localizeHref(href: string, hindi: boolean): string {
    if (!hindi || !href.startsWith("/")) return href;
    const cut = href.search(/[?#]/);
    const path = cut === -1 ? href : href.slice(0, cut);
    const rest = cut === -1 ? "" : href.slice(cut);
    const hi = toHindiPath(path);
    return hi ? hi + rest : href;
}

// A piece of text in both languages.
export type Text = { en: string; hi: string };

type TFunction = {
    (text: Text): string;
    (en: string, hi: string): string;
};

interface LangContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
    toggleLang: () => void;
    t: TFunction;
    /** True on the /hi routes. */
    hindiRoute: boolean;
    /** Maps an internal link to the /hi twin while on a /hi route; see localizeHref. */
    href: (href: string) => string;
}

export const STORAGE_KEY = "krishna-hotel-lang";

const makeT = (lang: Lang): TFunction =>
    ((en: string | Text, hi?: string) => {
        if (typeof en === "object") return lang === "hi" ? en.hi : en.en;
        return lang === "hi" ? (hi ?? en) : en;
    }) as TFunction;

const LangContext = createContext<LangContextValue>({
    lang: "en",
    setLang: () => {},
    toggleLang: () => {},
    t: makeT("en"),
    hindiRoute: false,
    href: (h) => h,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // usePathname works during prerendering too, so /hi pages are rendered in Hindi on the server.
    const hindiRoute = isHindiPath(usePathname());
    const [savedLang, setLangState] = useState<Lang>("en");
    const lang: Lang = hindiRoute ? "hi" : savedLang;

    // Read the saved choice only after mount, so the first client render matches the server HTML.
    // It only matters on English routes; /hi routes are always Hindi.
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved === "hi" || saved === "en") setLangState(saved);
        } catch {
            // Storage blocked (private mode etc.): stay in English.
        }
    }, []);

    // After visiting a /hi page, keep Hindi in memory, so following a link to an English-only
    // page (e.g. a footer link) does not flip the visitor back to English mid-visit.
    useEffect(() => {
        if (hindiRoute) setLangState("hi");
    }, [hindiRoute]);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next: Lang) => {
        setLangState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Not saved; the switch still works for this visit.
        }
    }, []);

    const value = useMemo<LangContextValue>(
        () => ({
            lang,
            setLang,
            toggleLang: () => setLang(lang === "en" ? "hi" : "en"),
            t: makeT(lang),
            hindiRoute,
            href: (h: string) => localizeHref(h, hindiRoute),
        }),
        [lang, setLang, hindiRoute]
    );

    return (
        <LangContext.Provider value={value}>
            {/* Letter-spacing splits Devanagari conjuncts and matras, so turn it off for Hindi text. */}
            <style>{`[lang="hi"] [class*="tracking-"]{letter-spacing:normal}[lang="hi"]{font-family:var(--font-hind),var(--font-inter),sans-serif}[lang="hi"] h1,[lang="hi"] h2,[lang="hi"] h3,[lang="hi"] .font-heading{font-family:var(--font-poppins),var(--font-hind),sans-serif;line-height:1.3}`}</style>
            {/* lang on a layout-neutral wrapper, so the server HTML of /hi pages is marked as Hindi
                (the root <html lang> is static and only updated by the effect above). */}
            <div lang={lang} className="contents">
                {children}
            </div>
        </LangContext.Provider>
    );
}

export const useLang = () => useContext(LangContext);
