import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Contact from "@/server/models/Contact";
import nodemailer from "nodemailer";
import { SMTP_CONFIG } from "@/lib/config";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    console.log("SMTP connection verified successfully for resend");
  } catch (verifyError) {
    console.error("SMTP verification failed for resend:", verifyError);
    // Log the error but don't throw - we'll still save the contact request
    console.log(
      "Continuing without email verification - OTP will be logged instead"
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_CONFIG.from,
      to: email,
      subject: "Resend: Verify Your Contact Request",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f9ce20;">Verification Code</h2>
          <p>Your new verification code is:</p>
          <div style="background: #000; color: #f9ce20; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 20px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    });
    console.log("Resend OTP email sent successfully to:", email);
  } catch (emailError) {
    console.error("Failed to send resend OTP email:", emailError);
    // Don't throw the error - just log it and continue
    console.log("Resend OTP for manual testing:", otp);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { contactId } = await req.json();

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not configured");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    await dbConnect();

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    if (contact.verified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    contact.otp = otp;
    contact.otpExpiry = otpExpiry;
    await contact.save();

    if (contact.contactMethod === "email") {
      await sendOTPEmail(contact.contactValue, otp);
      console.log(
        `Resend OTP for ${contact.contactValue}: ${otp} (expires in 10 minutes)`
      );
    } else {
      console.log("Resend OTP for phone:", otp);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend OTP error:", error);

    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { error: "Database configuration error. Please contact support." },
          { status: 500 }
        );
      }
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("timeout")
      ) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to resend OTP. Please try again." },
      { status: 500 }
    );
  }
}
