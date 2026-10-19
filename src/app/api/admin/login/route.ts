import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_HOURS,
  checkAdminPassword,
  clearLoginFailures,
  createSessionToken,
  loginLockedFor,
  recordLoginFailure,
} from "@/lib/adminAuth";

const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const locked = loginLockedFor(ip);
  if (locked) {
    return NextResponse.json(
      { error: `Too many wrong attempts. Try again in ${Math.ceil(locked / 60)} minutes.` },
      { status: 429 }
    );
  }

  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set on the server." }, { status: 500 });
  }
  if (!checkAdminPassword(password)) {
    recordLoginFailure(ip);
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  clearLoginFailures(ip);
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
