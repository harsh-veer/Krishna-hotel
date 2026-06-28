import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || id.length !== 24) { // MongoDB ObjectId check
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    await dbConnect();
    const booking = await Contact.findById(id);

    if (!booking) {
      return NextResponse.json({ exists: false }, { status: 404 });
    }

    // Return only public non-sensitive details
    return NextResponse.json({
      exists: true,
      name: booking.name,
      roomType: booking.roomType,
      status: booking.status
    }, { status: 200 });

  } catch (error) {
    console.error('Verify Booking Error:', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
