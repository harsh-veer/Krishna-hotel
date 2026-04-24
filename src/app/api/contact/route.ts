import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    if (!body.name || !body.email || !body.phone || !body.checkIn || !body.checkOut || !body.guests) {
      return NextResponse.json(
        { error: 'Name, email, phone, check-in, check-out, and guests are required fields.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create the contact message
    const newContact = await Contact.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      checkIn: body.checkIn,
      checkOut: body.checkOut,
      guests: body.guests,
      message: body.message,
    });

    return NextResponse.json(
      { message: 'Your booking request has been sent successfully!', data: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
