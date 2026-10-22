// Server-safe URL helpers for the English/Hindi page pairs, used in page metadata (hreflang).
// Kept out of src/lib/i18n.tsx because that is a client module.
import { SITE_URL } from "@/lib/hotel";

// Absolute English and Hindi URLs for an English path that has a /hi twin ("/" or "/rooms/x").
export function pageUrls(enPath: string) {
  const en = enPath === "/" ? SITE_URL : `${SITE_URL}${enPath}`;
  const hi = enPath === "/" ? `${SITE_URL}/hi` : `${SITE_URL}/hi${enPath}`;
  return { en, hi };
}

// hreflang alternates for a page pair; the same object goes on both language versions.
export function languageAlternates(enPath: string) {
  const { en, hi } = pageUrls(enPath);
  return { "en-IN": en, "hi-IN": hi, "x-default": en };
}
