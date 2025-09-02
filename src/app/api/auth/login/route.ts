import { NextResponse } from "next/server";
import { login } from "@/server/services/auth.service";
import { loginSchema } from "@/server/validators/auth.validator";
import connectDB from "@/server/lib/mongoDb";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse({ body });
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    await connectDB();

    const { user, token } = await login(validation.data.body);

    const response = new NextResponse(JSON.stringify({ user }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 400 }
    );
  }
}
