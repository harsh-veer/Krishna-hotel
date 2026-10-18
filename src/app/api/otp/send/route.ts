import { NextResponse } from "next/server";
import { EMAIL_REGEX, issueOtp, normalizeEmail } from "@/lib/otp";
import { EMAIL_ERROR } from "@/lib/validation";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: EMAIL_ERROR }, { status: 400 });
    }

    const result = await issueOtp(email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, retryAfter: result.retryAfter }, { status: 429 });
    }

    await sendOtpEmail(normalizeEmail(email), result.code);
    return NextResponse.json({ message: "Verification code sent." }, { status: 200 });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json(
      { error: "Could not send the code right now. Please call us at +91 86046 80149." },
      { status: 500 }
    );
  }
}
