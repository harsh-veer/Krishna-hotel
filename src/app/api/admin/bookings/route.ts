import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function POST() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    await dbConnect();

    // Fetch all bookings, sorted by newest first
    const bookings = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
