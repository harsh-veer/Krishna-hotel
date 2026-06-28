import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

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

    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Booking not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking: updated }, { status: 200 });
  } catch (error) {
    console.error('Update Booking Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
