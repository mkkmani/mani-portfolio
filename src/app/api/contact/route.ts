import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Contact from '@/server/models/Contact';
import nodemailer from 'nodemailer';
import { SMTP_CONFIG } from '@/lib/config';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count >= 5) {
    return false;
  }

  limit.count++;
  return true;
}

function generateOTP(length = 6): string {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let otp = '';
  array.forEach(value => {
    otp += (value % 10).toString();
  });

  return otp.slice(0, length);
}


async function sendOTPEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    requireTLS: true,
    auth: {
      user: SMTP_CONFIG.user,
      pass: SMTP_CONFIG.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (verifyError) {
    console.error('SMTP verification failed:', verifyError);
    throw verifyError;
  }

  await transporter.sendMail({
    from: SMTP_CONFIG.from,
    to: email,
    subject: 'Verify Your Contact Request',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f9ce20;">Verification Code</h2>
        <p>Your verification code is:</p>
        <div style="background: #000; color: #f9ce20; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
          ${otp}
        </div>
        <p style="color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
        <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, contactMethod, contactValue, message, privacyAccepted } = await req.json();

    if (!name || !contactMethod || !contactValue || !message || !privacyAccepted) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const contact = await Contact.create({
      name,
      contactMethod,
      contactValue,
      message,
      otp,
      otpExpiry,
      verified: false,
    });

    if (contactMethod === 'email') {
      await sendOTPEmail(contactValue, otp);
    } else {
      console.log('OTP for phone:', otp);
    }

    return NextResponse.json({ contactId: contact._id.toString() });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}
