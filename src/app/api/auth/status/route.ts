import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_CONFIG.name)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      authenticated: true,
      username: payload.username
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
