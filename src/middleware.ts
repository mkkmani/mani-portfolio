import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/identify-me", req.url));
  }
}

export const config = {
  matcher: ["/notelogs/add", "/notelogs/edit/:id"],
};
