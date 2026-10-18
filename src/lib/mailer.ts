import nodemailer from "nodemailer";

// Sends through a Gmail account using an App Password (free, about 500 emails a day).
// Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local / Vercel environment variables.
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass: pass.replace(/\s+/g, "") },
    });
  }
  return transporter;
}

export async function sendOtpEmail(to: string, code: string) {
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without Gmail set up: print the code instead of emailing it.
      console.log(`[OTP] ${to}: ${code}`);
      return;
    }
    throw new Error("Email sending is not configured (GMAIL_USER / GMAIL_APP_PASSWORD).");
  }

  await t.sendMail({
    from: `"Krishna Hotel" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${code} is your Krishna Hotel verification code`,
    text: `Your Krishna Hotel verification code is ${code}.\n\nIt is valid for 10 minutes. If you did not request this, you can ignore this email.\n\nKrishna Hotel, Ayodhya-Akbarpur Road, Ambedkar Nagar\n+91 86046 80149`,
    html: `<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="color:#1e3a8a;margin:0 0 12px">Krishna Hotel</h2>
  <p style="margin:0 0 16px;color:#374151">Use this code to confirm your booking request:</p>
  <p style="font-size:32px;font-weight:bold;letter-spacing:8px;margin:0 0 16px;color:#111827">${code}</p>
  <p style="margin:0;color:#6b7280;font-size:13px">Valid for 10 minutes. If you did not request this, you can ignore this email.</p>
  <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Ayodhya-Akbarpur Road, Ambedkar Nagar · +91 86046 80149</p>
</div>`,
  });
}
