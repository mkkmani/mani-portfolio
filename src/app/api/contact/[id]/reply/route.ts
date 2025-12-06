import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Contact from '@/server/models/Contact';
import nodemailer from 'nodemailer';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG, SMTP_CONFIG } from '@/lib/config';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get(COOKIE_CONFIG.name)?.value;
    if (!token) return false;

    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

async function sendReplyEmail(to: string, reply: string, originalMessage: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass,
    },
  });

  await transporter.sendMail({
    from: SMTP_CONFIG.from,
    to,
    subject: 'Re: Your Message to Manikanta',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f9ce20;">Response from Manikanta</h2>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 4px solid #f9ce20;">
          ${reply}
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
        <p style="color: #666; font-size: 14px;">Your original message:</p>
        <div style="background: #f9f9f9; padding: 15px; color: #666; font-size: 14px;">
          ${originalMessage}
        </div>
      </div>
    `,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reply } = await req.json();

    if (!reply) {
      return NextResponse.json({ error: 'Reply is required' }, { status: 400 });
    }

    await dbConnect();

    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    if (!contact.verified) {
      return NextResponse.json({ error: 'Contact not verified' }, { status: 400 });
    }

    contact.adminReply = reply;
    contact.replied = true;
    contact.repliedAt = new Date();
    await contact.save();

    if (contact.contactMethod === 'email') {
      await sendReplyEmail(contact.contactValue, reply, contact.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
