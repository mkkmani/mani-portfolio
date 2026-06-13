import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Contact from "@/server/models/Contact";
import { verifyOtp } from "@/lib/otp";
import { isValidObjectId } from "@/lib/validation";
import { rateLimit, tooManyRequests, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const { contactId, otp } = await req.json();

    if (!isValidObjectId(contactId) || !otp) {
      return NextResponse.json({ error: "Contact ID and OTP are required" }, { status: 400 });
    }

    const limit = await rateLimit("otp-verify", `${contactId}:${clientIp(req)}`, 5, "10 m");
    if (!limit.success) return tooManyRequests(limit.reset);

    await dbConnect();
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    if (contact.verified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }
    if (!contact.otp || !contact.otpExpiry || contact.otpExpiry < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }
    if (!verifyOtp(String(otp), contact.otp)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    contact.verified = true;
    contact.otp = undefined;
    contact.otpExpiry = undefined;
    await contact.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
