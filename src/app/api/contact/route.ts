import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Contact from "@/server/models/Contact";
import { sendMail } from "@/lib/email";
import { generateOtp, hashOtp } from "@/lib/otp";
import { rateLimit, tooManyRequests, clientIp } from "@/lib/rate-limit";
import { isEmail, isNonEmptyString } from "@/lib/validation";
import { otpEmailHtml } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const limit = await rateLimit("contact", ip, 5, "1 m");
    if (!limit.success) return tooManyRequests(limit.reset);

    const { name, contactMethod, contactValue, message, privacyAccepted } =
      await req.json();

    if (!isNonEmptyString(name, 200) || !contactValue || !isNonEmptyString(message, 5000) || !privacyAccepted) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!["email", "phone"].includes(contactMethod)) {
      return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
    }
    if (contactMethod === "email" && !isEmail(contactValue)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    await dbConnect();

    const otp = generateOtp();
    const contact = await Contact.create({
      name,
      contactMethod,
      contactValue,
      message,
      otp: hashOtp(otp),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });

    if (contactMethod === "email") {
      try {
        await sendMail({
          to: contactValue,
          subject: "Verify Your Contact Request",
          html: otpEmailHtml(otp),
        });
      } catch (mailErr) {
        console.error("Failed to send OTP email:", mailErr);
        await Contact.findByIdAndDelete(contact._id);
        return NextResponse.json(
          { error: "Could not send the verification email. Please try again." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ contactId: contact._id.toString() });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form. Please try again." },
      { status: 500 }
    );
  }
}
