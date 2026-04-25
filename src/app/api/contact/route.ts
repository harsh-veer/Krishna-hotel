import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

async function sendTelegramAlert(booking: {
  name: string;
  phone: string;
  email: string;
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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const text =
    `🔔 <b>New Booking at Krishna Hotel!</b>\n\n` +
    `👤 <b>Name:</b> ${booking.name}\n` +
    `📞 <b>Phone:</b> ${booking.phone}\n` +
    `📧 <b>Email:</b> ${booking.email}\n` +
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

    // Validate request body
    if (!body.name || !body.email || !body.phone || !body.checkIn || !body.checkOut || !body.guests) {
      return NextResponse.json(
        { error: 'Name, email, phone, check-in, check-out, and guests are required fields.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create the contact message
    const newContact = await Contact.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      message: body.message,
    });

    // Fire Telegram alert (non-blocking — won't break booking on failure)
    sendTelegramAlert(body);

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

