"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Site language: English by default (that is what the server renders, for SEO and so
// hydration matches), switched to Hindi on the client and remembered in localStorage.
export type Lang = "en" | "hi";

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
}

const STORAGE_KEY = "krishna-hotel-lang";

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
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    // Read the saved choice only after mount, so the first client render matches the server HTML.
    useEffect(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved === "hi" || saved === "en") setLangState(saved);
        } catch {
            // Storage blocked (private mode etc.): stay in English.
        }
    }, []);

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
        }),
        [lang, setLang]
    );

    return (
        <LangContext.Provider value={value}>
            {/* Letter-spacing splits Devanagari conjuncts and matras, so turn it off for Hindi text. */}
            <style>{`html[lang="hi"] [class*="tracking-"]{letter-spacing:normal}`}</style>
            {children}
        </LangContext.Provider>
    );
}

export const useLang = () => useContext(LangContext);
