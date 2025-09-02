import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Paths that require authentication
  const protectedPaths = ["/admin"];
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If not a protected path, continue
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = await getToken({
    req: request as any,
    secret: process.env.JWT_SECRET,
  });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is admin
  if (token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Continue if authenticated and authorized
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)",
  ],
};
