import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Contact from "@/server/models/Contact";
import { sendMail } from "@/lib/email";
import { generateOtp, hashOtp } from "@/lib/otp";
import { otpEmailHtml } from "@/lib/email-templates";
import { isValidObjectId } from "@/lib/validation";
import { rateLimit, tooManyRequests, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limit = await rateLimit("contact-resend", ip, 3, "10 m");
    if (!limit.success) return tooManyRequests(limit.reset);

    const { contactId } = await req.json();
    if (!isValidObjectId(contactId)) {
      return NextResponse.json({ error: "Valid contact ID is required" }, { status: 400 });
    }

    await dbConnect();
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    if (contact.verified) {
      return NextResponse.json({ error: "Already verified" }, { status: 400 });
    }

    const otp = generateOtp();
    contact.otp = hashOtp(otp);
    contact.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await contact.save();

    if (contact.contactMethod === "email") {
      try {
        await sendMail({
          to: contact.contactValue,
          subject: "Resend: Verify Your Contact Request",
          html: otpEmailHtml(otp, true),
        });
      } catch (mailErr) {
        console.error("Failed to resend OTP email:", mailErr);
        return NextResponse.json(
          { error: "Could not send the verification email. Please try again." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend OTP. Please try again." },
      { status: 500 }
    );
  }
}
