import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { EventBooking } from '@/models/EventBooking';
import { EVENT_STATUSES } from '@/lib/events';
import { sendEventStatusEmail } from '@/lib/mailer';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!(EVENT_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: `Invalid status: "${status}".` }, { status: 400 });
    }

    await dbConnect();
    const previous = await EventBooking.findByIdAndUpdate(id, { status });
    if (!previous) return NextResponse.json({ error: 'Event booking not found.' }, { status: 404 });

    // Email the guest when the event is confirmed or cancelled (only when the status actually changes).
    let emailSent = false;
    if ((status === 'Confirmed' || status === 'Cancelled') && previous.status !== status && previous.email) {
      try {
        emailSent = await sendEventStatusEmail({
          reference: String(previous._id).slice(-6).toUpperCase(),
          name: previous.name,
          email: previous.email,
          phone: previous.phone,
          eventType: previous.eventType,
          eventDate: previous.eventDate,
          slot: previous.slot,
          guests: previous.guests,
          status,
        });
      } catch (mailError) {
        console.error('Event status email failed:', mailError);
      }
    }

    return NextResponse.json({ success: true, event: { ...previous.toObject(), status }, emailSent });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { id } = await params;
    await dbConnect();
    const deleted = await EventBooking.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Event booking not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
