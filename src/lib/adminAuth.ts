import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Admin login sessions: a signed, httpOnly cookie instead of keeping the password in the browser.
// The signature uses ADMIN_PASSWORD, so changing the password logs every device out.
export const ADMIN_COOKIE = "kh_admin";
export const SESSION_HOURS = 8;

const secret = () =>
  `${process.env.ADMIN_PASSWORD || ""}:${process.env.ADMIN_SESSION_SECRET || process.env.OTP_SECRET || ""}`;

const sign = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("hex");

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

export function checkAdminPassword(password: unknown) {
  // Trim both sides: a space or newline pasted into Vercel or the login box is easy to miss.
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || typeof password !== "string") return false;
  // Compare hashes so the comparison takes the same time whatever the input length.
  const h = (v: string) => crypto.createHash("sha256").update(v).digest("hex");
  return safeEqual(h(password.trim()), h(expected));
}

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

// Returns a 401 response when the request is not from a logged-in admin, otherwise null.
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Your admin session has expired. Please log in again." }, { status: 401 });
}

// Best-effort brute-force brake: per server instance, 5 wrong tries per IP locks login for 15 minutes.
const failures = new Map<string, { count: number; until: number }>();

export function loginLockedFor(ip: string) {
  const f = failures.get(ip);
  if (!f || f.until < Date.now()) return 0;
  return f.count >= 5 ? Math.ceil((f.until - Date.now()) / 1000) : 0;
}

export function recordLoginFailure(ip: string) {
  const f = failures.get(ip);
  const fresh = !f || f.until < Date.now();
  failures.set(ip, { count: fresh ? 1 : f.count + 1, until: Date.now() + 15 * 60 * 1000 });
}

export function clearLoginFailures(ip: string) {
  failures.delete(ip);
}
