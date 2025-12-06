// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/server/db';
// import Admin from '@/server/models/Admin';
// import bcrypt from 'bcryptjs';
// import { jwtVerify } from 'jose';
// import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

// export async function POST(req: NextRequest) {
//   try {
//     await dbConnect();
//     const { username, password } = await req.json();

//     if (!username || !password) {
//       return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
//     }

//     const adminCount = await Admin.countDocuments();

//     if (adminCount > 0) {
//       const token = req.cookies.get(COOKIE_CONFIG.name)?.value;

//       if (!token) {
//         return NextResponse.json({ error: 'Unauthorized: Admin already exists' }, { status: 401 });
//       }

//       try {
//         await jwtVerify(token, JWT_SECRET);
//       } catch (err) {
//         return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//       }
//     }

//     const existingAdmin = await Admin.findOne({ username });
//     if (existingAdmin) {
//       return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await Admin.create({
//       username,
//       passwordHash: hashedPassword,
//     });

//     return NextResponse.json({ success: true, message: 'Admin created successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
