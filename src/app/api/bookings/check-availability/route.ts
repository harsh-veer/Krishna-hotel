import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

const INVENTORY: Record<string, number> = {
  "Super-Deluxe Room": 2,
  "Standard Ac Room": 2,
  "Non-Ac Deluxe": 6,
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const roomType = searchParams.get('roomType');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (!roomType || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'roomType, checkIn, and checkOut are required query parameters.' },
        { status: 400 }
      );
    }

    const totalInventory = INVENTORY[roomType];
    if (totalInventory === undefined) {
      return NextResponse.json(
        { error: `Invalid roomType: "${roomType}"` },
        { status: 400 }
      );
    }

    await dbConnect();

    // Query for overlapping active bookings
    // A booking overlaps if: booking.checkIn < requestedCheckOut AND booking.checkOut > requestedCheckIn
    const overlappingBookings = await Contact.find({
      roomType,
      status: { $nin: ['Cancelled', 'Checked-out'] },
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    const bookedCount = overlappingBookings.length;
    const remaining = Math.max(0, totalInventory - bookedCount);
    const available = remaining > 0;

    return NextResponse.json({
      available,
      remaining,
      total: totalInventory,
      bookedCount
    }, { status: 200 });

  } catch (error) {
    console.error('Check Availability API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
