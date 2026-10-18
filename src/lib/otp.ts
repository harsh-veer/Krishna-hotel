import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import { Otp } from "@/models/Otp";

export const OTP_LENGTH = 6;
const CODE_TTL_MS = 10 * 60 * 1000; // code is valid for 10 minutes
const VERIFIED_TTL_MS = 30 * 60 * 1000; // a verified email can book for 30 minutes
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

export { BOOKING_EMAIL_REGEX as EMAIL_REGEX } from "@/lib/validation";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hashCode = (email: string, code: string) =>
  crypto
    .createHmac("sha256", process.env.OTP_SECRET || process.env.MONGODB_URI || "krishna-hotel-otp")
    .update(`${email}:${code}`)
    .digest("hex");

type IssueResult =
  | { ok: true; code: string }
  | { ok: false; error: string; retryAfter?: number };

export async function issueOtp(rawEmail: string): Promise<IssueResult> {
  const email = normalizeEmail(rawEmail);
  await dbConnect();

  const now = Date.now();
  const existing = await Otp.findOne({ email });

  if (existing) {
    const sinceLast = now - existing.lastSentAt.getTime();
    if (sinceLast < RESEND_COOLDOWN_MS) {
      const retryAfter = Math.ceil((RESEND_COOLDOWN_MS - sinceLast) / 1000);
      return { ok: false, error: `Please wait ${retryAfter}s before requesting another code.`, retryAfter };
    }
    const inWindow = now - existing.windowStart.getTime() < 60 * 60 * 1000;
    if (inWindow && existing.sendCount >= MAX_SENDS_PER_HOUR) {
      return { ok: false, error: "Too many codes requested. Please try again in an hour or call us." };
    }
  }

  const code = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, "0");
  const inWindow = existing && now - existing.windowStart.getTime() < 60 * 60 * 1000;

  await Otp.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        codeHash: hashCode(email, code),
        attempts: 0,
        sendCount: inWindow ? existing!.sendCount + 1 : 1,
        windowStart: inWindow ? existing!.windowStart : new Date(now),
        lastSentAt: new Date(now),
        // Keep the record for the hour so the send limit holds, even after the code expires.
        expiresAt: new Date(now + 60 * 60 * 1000),
      },
      $unset: { verifiedAt: 1 },
    },
    { upsert: true }
  );

  return { ok: true, code };
}

export async function verifyOtp(rawEmail: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const email = normalizeEmail(rawEmail);
  await dbConnect();

  const record = await Otp.findOne({ email });
  if (!record || Date.now() - record.lastSentAt.getTime() > CODE_TTL_MS) {
    return { ok: false, error: "Code expired. Please request a new one." };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Too many wrong attempts. Please request a new code." };
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(email, code.trim()), "hex");
  if (!crypto.timingSafeEqual(expected, actual)) {
    record.attempts += 1;
    await record.save();
    return { ok: false, error: "Incorrect code. Please check your email and try again." };
  }

  record.verifiedAt = new Date();
  record.expiresAt = new Date(Date.now() + VERIFIED_TTL_MS);
  await record.save();
  return { ok: true };
}

// Used by the booking API: true only if this email passed OTP in the last 30 minutes.
// The verification is used up so each code covers one booking.
export async function consumeVerifiedEmail(rawEmail: string): Promise<boolean> {
  const email = normalizeEmail(rawEmail);
  await dbConnect();
  const record = await Otp.findOneAndUpdate(
    { email, verifiedAt: { $gte: new Date(Date.now() - VERIFIED_TTL_MS) } },
    { $unset: { verifiedAt: 1 } }
  );
  return !!record;
}
