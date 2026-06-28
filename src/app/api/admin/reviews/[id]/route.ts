import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Review } from '@/models/Review';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { password, isApproved, ownerResponse } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid password.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const updateFields: Record<string, any> = {};
    if (isApproved !== undefined) updateFields.isApproved = isApproved;
    if (ownerResponse !== undefined) updateFields.ownerResponse = ownerResponse;

    const updated = await Review.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Review not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review: updated }, { status: 200 });
  } catch (error) {
    console.error('Update Review Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    const deleted = await Review.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Review not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Review deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Delete Review Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
