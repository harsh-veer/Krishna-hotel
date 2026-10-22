import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { EventBooking } from '@/models/EventBooking';
import { consumeVerifiedEmail, EMAIL_REGEX, normalizeEmail } from '@/lib/otp';
import { EMAIL_ERROR, isValidIndianMobile, normalizeIndianMobile, PHONE_ERROR } from '@/lib/validation';
import {
  eventSlotName,
  eventTypeName,
  isEventSlot,
  isEventType,
  MAX_EVENT_GUESTS,
  MIN_EVENT_GUESTS,
  todayInIndia,
} from '@/lib/events';
import { sendEventRequestEmail } from '@/lib/mailer';
import { escapeTelegram, sendTelegramMessage } from '@/lib/telegram';

const fail = (error: string, status = 400, extra: object = {}) =>
  NextResponse.json({ error, ...extra }, { status });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name ?? '').trim().slice(0, 80);
    const rawPhone = String(body.phone ?? '').trim();
    const email = normalizeEmail(String(body.email ?? ''));
    const eventType = body.eventType;
    const slot = body.slot;
    const eventDate = String(body.eventDate ?? '').trim();
    const guests = Number(body.guests);
    const message = String(body.message ?? '').trim().slice(0, 500);

    if (!name || !rawPhone) return fail('Name and phone number are required.');
    if (!isValidIndianMobile(rawPhone)) return fail(PHONE_ERROR);
    if (!EMAIL_REGEX.test(email)) return fail(EMAIL_ERROR);
    if (!isEventType(eventType)) return fail('Please choose the type of event.');
    if (!isEventSlot(slot)) return fail('Please choose a time slot.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) || Number.isNaN(new Date(eventDate).getTime())) {
      return fail('Please choose the event date.');
    }
    if (eventDate < todayInIndia()) return fail('The event date cannot be in the past.');
    if (!Number.isInteger(guests) || guests < MIN_EVENT_GUESTS || guests > MAX_EVENT_GUESTS) {
      return fail(`Please enter the number of guests (${MIN_EVENT_GUESTS} to ${MAX_EVENT_GUESTS}).`);
    }

    await dbConnect();

    // Same email check as room bookings: the address must have passed the OTP step.
    if (!(await consumeVerifiedEmail(email))) {
      return fail('Please verify your email with the code we sent before booking.', 403, { needsVerification: true });
    }

    const phone = normalizeIndianMobile(rawPhone);
    const booking = await EventBooking.create({
      name,
      phone,
      email,
      eventType,
      eventDate,
      slot,
      guests,
      message: message || undefined,
      status: 'Pending',
    });

    // Staff alert and guest receipt. Awaited so Vercel doesn't stop the function before they are sent;
    // a failure here must not fail the booking itself.
    const reference = String(booking._id).slice(-6).toUpperCase();
    const alert =
      `🎉 <b>New event request at Krishna Hotel</b>\n\n` +
      `🏛️ <b>Event:</b> ${escapeTelegram(eventTypeName(eventType))}\n` +
      `📅 <b>Date:</b> ${eventDate} (${escapeTelegram(eventSlotName(slot))})\n` +
      `👥 <b>Guests:</b> ${guests}\n` +
      `👤 <b>Name:</b> ${escapeTelegram(name)}\n` +
      `📞 <b>Phone:</b> ${phone}\n` +
      `📧 <b>Email:</b> ${escapeTelegram(email)}\n` +
      (message ? `📝 <b>Notes:</b> ${escapeTelegram(message)}\n` : '') +
      `\n<i>Ref ${reference}. Open the admin dashboard → Events to confirm.</i>`;

    const [, mail] = await Promise.allSettled([
      sendTelegramMessage(alert),
      sendEventRequestEmail({ reference, name, email, phone, eventType, eventDate, slot, guests }),
    ]);
    if (mail.status === 'rejected') console.error('Event request email failed:', mail.reason);

    return NextResponse.json({ message: 'Your event request has been sent!', reference }, { status: 201 });
  } catch (error) {
    console.error('Event booking error:', error);
    return fail('Internal Server Error', 500);
  }
}
