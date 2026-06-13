import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { SignJWT } from 'jose';
import { ADMIN_CREDENTIALS, JWT_SECRET, COOKIE_CONFIG, TOKEN_CONFIG } from '@/lib/config';
import { rateLimit, tooManyRequests, clientIp } from '@/lib/rate-limit';

// Constant-time string compare. Hashing first gives both sides a fixed length
// so timingSafeEqual never throws on length mismatch and length isn't leaked.
function safeEqual(a: string, b: string): boolean {
  const ah = createHash('sha256').update(a).digest();
  const bh = createHash('sha256').update(b).digest();
  return timingSafeEqual(ah, bh);
}

export async function POST(req: NextRequest) {
  try {
    const limit = await rateLimit('admin-login', clientIp(req), 10, '15 m');
    if (!limit.success) return tooManyRequests(limit.reset);

    if (!ADMIN_CREDENTIALS.username || !ADMIN_CREDENTIALS.password) {
      console.error('Login error: ADMIN_USERNAME / ADMIN_PASSWORD not configured');
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

    const { username, password } = await req.json();

    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Evaluate both comparisons regardless of outcome - no short-circuit that
    // would reveal which field was wrong, and one generic message for both.
    const okUser = safeEqual(username, ADMIN_CREDENTIALS.username);
    const okPass = safeEqual(password, ADMIN_CREDENTIALS.password);
    if (!okUser || !okPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ username: ADMIN_CREDENTIALS.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_CONFIG.expirationTime)
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      username: ADMIN_CREDENTIALS.username
    });

    response.cookies.set(COOKIE_CONFIG.name, token, {
      ...COOKIE_CONFIG.options,
      maxAge: COOKIE_CONFIG.maxAge,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
