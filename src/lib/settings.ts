import dbConnect from "@/lib/mongodb";
import { Settings, type ISettings } from "@/models/Settings";
import { ROOMS_DATA } from "@/lib/rooms";

// Rooms of each type, used until the hotel saves its own numbers in /admin → Settings.
export const DEFAULT_INVENTORY: Record<string, number> = {
  "Super-Deluxe Room": 2,
  "Standard Ac Room": 2,
  "Non-Ac Deluxe": 6,
};

export type SiteSettings = Pick<ISettings, "offer" | "inventory">;

const DEFAULTS: SiteSettings = {
  offer: { enabled: false, text: "", textHi: "", link: "" },
  inventory: DEFAULT_INVENTORY,
};

export async function getSettings(): Promise<SiteSettings> {
  await dbConnect();
  const doc = await Settings.findOne({ key: "site" }).lean();
  if (!doc) return DEFAULTS;
  const saved = doc.inventory instanceof Map ? Object.fromEntries(doc.inventory) : doc.inventory || {};
  return {
    offer: { ...DEFAULTS.offer, ...(doc.offer || {}) },
    inventory: { ...DEFAULT_INVENTORY, ...saved },
  };
}

const ROOM_NAMES = Object.values(ROOMS_DATA).map((r) => r.name);

// Validates and saves what the admin submitted. Returns an error message or the saved settings.
export async function saveSettings(input: Partial<SiteSettings>): Promise<string | SiteSettings> {
  const current = await getSettings();
  const next: SiteSettings = { ...current };

  if (input.offer) {
    const o = input.offer;
    const text = String(o.text ?? "").trim().slice(0, 160);
    const textHi = String(o.textHi ?? "").trim().slice(0, 160);
    const link = String(o.link ?? "").trim().slice(0, 300);
    if (o.enabled && !text) return "Please write the offer text before turning the banner on.";
    if (link && !/^(https?:\/\/|\/|#)/.test(link)) return "The link must start with https://, / or #.";
    next.offer = { enabled: Boolean(o.enabled), text, textHi, link };
  }

  if (input.inventory) {
    const inv: Record<string, number> = {};
    for (const name of ROOM_NAMES) {
      const n = Number(input.inventory[name] ?? current.inventory[name]);
      if (!Number.isInteger(n) || n < 0 || n > 100) return `Room count for ${name} must be a whole number from 0 to 100.`;
      inv[name] = n;
    }
    next.inventory = inv;
  }

  await Settings.findOneAndUpdate({ key: "site" }, { key: "site", ...next }, { upsert: true });
  return next;
}
