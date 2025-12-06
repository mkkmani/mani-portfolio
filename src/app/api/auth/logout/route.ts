import { NextResponse } from 'next/server';
import { COOKIE_CONFIG } from '@/lib/config';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_CONFIG.name, '', {
    ...COOKIE_CONFIG.options,
    maxAge: 0,
  });

  return response;
}
