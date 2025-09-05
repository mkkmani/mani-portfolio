import { NextRequest, NextResponse } from "next/server";
import { JwtPayloadSchema, verifyToken } from "@/server/services/authServices";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;


  const adminPaths = ["/notelogs/add", "/notelogs/edit/:id"];

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = verifyToken(token);

    const parsedPayload = JwtPayloadSchema.safeParse(decoded);

    if (!parsedPayload.success) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { role } = parsedPayload.data;

    if (adminPaths.includes(pathname)) {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/notelogs/add", request.url));
      } else if (role === "user") {
        return NextResponse.redirect(new URL("/notelogs", request.url));
      } else {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/notelogs/add", "/notelogs/edit/:id"],
};
