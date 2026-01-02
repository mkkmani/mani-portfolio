import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication for interview prep and profile
  const protectedRoutes = ['/interview-prep/new', '/profile'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check if user has a session cookie
    const sessionCookie = request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token');

    if (!sessionCookie) {
      // Redirect to sign-in page with callback URL
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/interview-prep/new', '/profile'],
};
