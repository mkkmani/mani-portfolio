import { NextResponse } from "next/server";
import { contactFormSchema } from "@/server/utils/contactValidation";
import { sendEmail } from "@/server/services/emailService";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = contactFormSchema.parse(body);
    await sendEmail(parsedData);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to send email", error: error },
      { status: 500 }
    );
  }
}
