import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { sendBookingStatusEmail } from '@/lib/mailer';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid password.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Booking deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Delete Booking Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password, status } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid password.' },
        { status: 401 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required.' },
        { status: 400 }
      );
    }

    const validStatuses = ["Pending", "Confirmed", "Cancelled", "Checked-in", "Checked-out"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: "${status}".` },
        { status: 400 }
      );
    }

    await dbConnect();

    const previous = await Contact.findByIdAndUpdate(id, { status });

    if (!previous) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    // Tell the guest when the booking is confirmed or cancelled (only when the status actually changes).
    let emailSent = false;
    if ((status === 'Confirmed' || status === 'Cancelled') && previous.status !== status && previous.email) {
      try {
        emailSent = await sendBookingStatusEmail({
          reference: String(previous._id).slice(-6).toUpperCase(),
          name: previous.name,
          email: previous.email,
          roomType: previous.roomType,
          checkIn: previous.checkIn,
          checkOut: previous.checkOut,
          guests: previous.guests,
          status,
        });
      } catch (mailError) {
        console.error('Status email failed:', mailError);
      }
    }

    const booking = { ...previous.toObject(), status };
    return NextResponse.json({ success: true, booking, emailSent }, { status: 200 });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
