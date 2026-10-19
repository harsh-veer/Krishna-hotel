import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';

export async function POST() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    await dbConnect();

    // Fetch all reviews, sorted by newest first
    const reviews = await Review.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Admin Fetch Reviews Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
