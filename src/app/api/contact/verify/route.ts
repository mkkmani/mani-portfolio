import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Contact from "@/server/models/Contact";

export async function POST(req: NextRequest) {
  try {
    const { contactId, otp } = await req.json();

    if (!contactId || !otp) {
      return NextResponse.json(
        { error: "Contact ID and OTP are required" },
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

    if (contact.otpExpiry < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (contact.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    contact.verified = true;
    contact.otp = undefined;
    contact.otpExpiry = undefined;
    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verification error:", error);

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
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
