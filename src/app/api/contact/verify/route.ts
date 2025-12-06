import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Contact from '@/server/models/Contact';

export async function POST(req: NextRequest) {
  try {
    const { contactId, otp } = await req.json();

    if (!contactId || !otp) {
      return NextResponse.json({ error: 'Contact ID and OTP are required' }, { status: 400 });
    }

    await dbConnect();

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (contact.verified) {
      return NextResponse.json({ error: 'Already verified' }, { status: 400 });
    }

    if (contact.otpExpiry < new Date()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    if (contact.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    contact.verified = true;
    contact.otp = undefined;
    contact.otpExpiry = undefined;
    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
