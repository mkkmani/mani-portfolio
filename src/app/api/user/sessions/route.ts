import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('[User Sessions API] Request received');

    // Verify user authentication
    const session = await auth();

    console.log('[User Sessions API] Session:', session?.user?.id || 'No session');

    if (!session?.user?.id) {
      console.log('[User Sessions API] Unauthorized - no user session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch only sessions belonging to the authenticated user
    const userSessions = await Preparation.find({
      userId: session.user.id
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`[User Sessions API] Found ${userSessions.length} sessions for user ${session.user.id}`);
    console.log('[User Sessions API] Sample session userId:', userSessions[0]?.userId);

    return NextResponse.json(userSessions);
  } catch (error) {
    console.error('[User Sessions API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch user sessions' }, { status: 500 });
  }
}
