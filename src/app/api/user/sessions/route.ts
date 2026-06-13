import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    const userSessions = await Preparation.find({ userId: session.user.id })
      .select('topic slug difficulty published excerpt sessionMetadata createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error('[User Sessions API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user sessions' }, { status: 500 });
  }
}
