import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid password.' },
        { status: 401 }
      );
    }

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
