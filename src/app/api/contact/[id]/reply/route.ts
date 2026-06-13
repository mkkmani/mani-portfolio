import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Contact from '@/server/models/Contact';
import { verifyAdminRequest } from '@/lib/verify-admin';
import { isValidObjectId, isNonEmptyString } from '@/lib/validation';
import { sendMail } from '@/lib/email';
import { replyEmailHtml } from '@/lib/email-templates';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Valid contact ID is required' }, { status: 400 });
    }

    const { reply } = await req.json();
    if (!isNonEmptyString(reply, 10000)) {
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

    // Send first; only persist as replied if the email actually went out.
    if (contact.contactMethod === 'email') {
      try {
        await sendMail({
          to: contact.contactValue,
          subject: 'Re: Your Message to Manikanta',
          html: replyEmailHtml(reply, contact.message),
        });
      } catch (mailErr) {
        console.error('Failed to send reply email:', mailErr);
        return NextResponse.json(
          { error: 'Could not send the reply email. Please try again.' },
          { status: 502 }
        );
      }
    }

    contact.adminReply = reply;
    contact.replied = true;
    contact.repliedAt = new Date();
    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
