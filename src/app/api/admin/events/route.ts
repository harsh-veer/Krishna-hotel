import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { EventBooking } from '@/models/EventBooking';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await dbConnect();
    // Upcoming events first, then past ones, newest request first within a date.
    const events = await EventBooking.find({}).sort({ eventDate: 1, createdAt: -1 }).limit(500);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Admin events error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
