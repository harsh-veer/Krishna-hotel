import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSettings, saveSettings } from "@/lib/settings";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return NextResponse.json(await getSettings());
  } catch (error) {
    console.error("Admin Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const result = await saveSettings(await req.json());
    if (typeof result === "string") return NextResponse.json({ error: result }, { status: 400 });
    return NextResponse.json({ success: true, settings: result });
  } catch (error) {
    console.error("Admin Settings Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
