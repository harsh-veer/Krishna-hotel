import { after, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { consumeVerifiedEmail, EMAIL_REGEX, normalizeEmail } from '@/lib/otp';
import { EMAIL_ERROR, isValidIndianMobile, normalizeIndianMobile, PHONE_ERROR } from '@/lib/validation';
import { sendBookingRequestEmail } from '@/lib/mailer';
import { GUEST_LIMIT_BY_ROOM } from '@/lib/rooms';

async function sendTelegramAlert(booking: {
  name: string;
  phone: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  message?: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram not configured — skipping alert.');
    return;
  }

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const text =
    `🔔 <b>New Booking at Krishna Hotel!</b>\n\n` +
    `👤 <b>Name:</b> ${booking.name}\n` +
    `📞 <b>Phone:</b> ${booking.phone}\n` +
    `📧 <b>Email:</b> ${booking.email}\n` +
    `🏨 <b>Room:</b> ${booking.roomType}\n` +
    `📅 <b>Check-in:</b> ${formatDate(booking.checkIn)}\n` +
    `📅 <b>Check-out:</b> ${formatDate(booking.checkOut)}\n` +
    `👥 <b>Guests:</b> ${booking.guests}\n` +
    (booking.message ? `📝 <b>Requests:</b> ${booking.message}\n` : '') +
    `\n<i>Log in to the admin dashboard to manage this booking.</i>`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
    const result = await res.json();
    if (!result.ok) {
      console.error('Telegram API error:', result);
    } else {
      console.log('✅ Telegram alert sent successfully.');
    }
  } catch (err) {
    console.error('Telegram alert failed:', err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const rawPhone = body.phone?.trim() || '';
    const email = normalizeEmail(body.email || '');
    const roomType = body.roomType?.trim() || 'Standard Ac Room';
    const guests = body.guests?.trim() || '2';
    let checkIn = body.checkIn?.trim();
    let checkOut = body.checkOut?.trim();

    // Default checkIn to today if missing
    if (!checkIn) {
      checkIn = new Date().toISOString().split('T')[0];
    }

    // Default checkOut to 1 day after checkIn if missing
    if (!checkOut) {
      const inDate = new Date(checkIn);
      const nextDay = new Date(inDate.getTime() + 86400000);
      checkOut = nextDay.toISOString().split('T')[0];
    }

    // Validate essential fields
    if (!name || !rawPhone) {
      return NextResponse.json(
        { error: 'Name and phone number are required.' },
        { status: 400 }
      );
    }

    if (!isValidIndianMobile(rawPhone)) {
      return NextResponse.json({ error: PHONE_ERROR }, { status: 400 });
    }
    const phone = normalizeIndianMobile(rawPhone);

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: EMAIL_ERROR }, { status: 400 });
    }

    const validRooms = ["Super-Deluxe Room", "Standard Ac Room", "Non-Ac Deluxe"];
    const finalRoomType = validRooms.includes(roomType) ? roomType : "Standard Ac Room";

    const guestLimit = GUEST_LIMIT_BY_ROOM[finalRoomType] ?? 2;
    const guestCount = parseInt(guests, 10);
    if (!Number.isFinite(guestCount) || guestCount < 1 || guestCount > guestLimit) {
      return NextResponse.json(
        { error: `The ${finalRoomType} fits up to ${guestLimit} guests. For more people, please book 2 rooms.` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Every booking needs an email address that passed OTP verification.
    if (!(await consumeVerifiedEmail(email))) {
      return NextResponse.json(
        { error: 'Please verify your email with the code we sent before booking.', needsVerification: true },
        { status: 403 }
      );
    }

    // Create the contact message
    const newContact = await Contact.create({
      name,
      email,
      phone,
      roomType: finalRoomType,
      checkIn,
      checkOut,
      guests,
      status: 'Pending',
      message: body.message || 'Instant AI Booking Request',
    });

    // Telegram alert and guest receipt run after the response is sent. Vercel freezes a function
    // once it responds, so an un-awaited fetch used to sit idle until the next request woke it up.
    // after() keeps the function alive until both finish, and the guest isn't kept waiting.
    after(async () => {
      await Promise.allSettled([
        sendTelegramAlert({
          name,
          email,
          phone,
          roomType: finalRoomType,
          checkIn,
          checkOut,
          guests,
          message: body.message,
        }),
        sendBookingRequestEmail({
          reference: String(newContact._id).slice(-6).toUpperCase(),
          name,
          email,
          phone,
          roomType: finalRoomType,
          checkIn,
          checkOut,
          guests,
        }).catch((err) => console.error('Booking email failed:', err)),
      ]);
    });

    return NextResponse.json(
      { message: 'Your booking request has been sent successfully!', data: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
