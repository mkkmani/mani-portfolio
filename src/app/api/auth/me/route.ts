import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/auth.service";
import connectDB from "@/server/lib/mongoDb";

// This is required to enable edge runtime
export const runtime = "edge";

// Prevent Next.js from adding body parsing to this route
export const dynamic = "force-dynamic";

// Extend the Request type to include cookies
type RequestWithCookies = Request & {
  cookies: {
    get: (name: string) => { value: string } | undefined;
  };
};

export async function GET(request: RequestWithCookies) {
  try {
    // Connect to database
    await connectDB();

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current user
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
