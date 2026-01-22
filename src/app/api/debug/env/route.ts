import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envStatus = {
      mongodb: !!process.env.MONGODB_URI,
      smtp: {
        host: !!process.env.SMTP_HOST,
        port: !!process.env.SMTP_PORT,
        user: !!process.env.SMTP_USER,
        pass: !!process.env.SMTP_PASS,
        from: !!process.env.SMTP_FROM,
      },
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(envStatus);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check environment status" },
      { status: 500 }
    );
  }
}
