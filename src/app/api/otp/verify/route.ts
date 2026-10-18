import { NextResponse } from "next/server";
import { EMAIL_REGEX, OTP_LENGTH, verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (typeof code !== "string" || !new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code.trim())) {
      return NextResponse.json({ error: `Please enter the ${OTP_LENGTH}-digit code.` }, { status: 400 });
    }

    const result = await verifyOtp(email, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
