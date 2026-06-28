import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { Contact } from '@/models/Contact';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, rating, text, bookingId } = await req.json();

    if (!name || !rating || !text) {
      return NextResponse.json(
        { error: 'Name, rating, and text are required fields.' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify bookingId if provided
    if (bookingId) {
      const booking = await Contact.findById(bookingId).catch(() => null);
      if (!booking) {
        return NextResponse.json(
          { error: 'Invalid booking reference. Review could not be verified.' },
          { status: 400 }
        );
      }
    }

    const newReview = await Review.create({
      bookingId,
      name,
      rating,
      text,
      isApproved: false // Requires admin moderation
    });

    return NextResponse.json(
      { message: 'Review submitted successfully! It will appear on the site once approved by the admin.', review: newReview },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit Review Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
