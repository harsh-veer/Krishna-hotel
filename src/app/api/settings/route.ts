import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

// Public: only the offer banner. Cached briefly at the edge so the banner doesn't hit the DB on every page view.
export async function GET() {
  try {
    const { offer } = await getSettings();
    return NextResponse.json(
      { offer: offer.enabled ? offer : null },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("Settings API Error:", error);
    return NextResponse.json({ offer: null });
  }
}
