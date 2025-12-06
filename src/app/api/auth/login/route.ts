import { NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Admin from '@/server/models/Admin';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG, TOKEN_CONFIG } from '@/lib/config';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid credentials format' }, { status: 400 });
    }

    let admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid username' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(TOKEN_CONFIG.expirationTime)
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      username: admin.username
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
