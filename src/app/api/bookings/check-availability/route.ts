import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { getAvailability } from '@/lib/availability';

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

    await dbConnect();
    const result = await getAvailability(roomType, checkIn, checkOut);
    if (!result) {
      return NextResponse.json(
        { error: `Invalid roomType: "${roomType}"` },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Check Availability API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
