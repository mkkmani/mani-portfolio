import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import Blog from '@/server/models/Blog';
import { auth } from '@/lib/auth';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get(COOKIE_CONFIG.name)?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// POST: Create a publish request
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await auth();

    const body = await req.json();
    const { contentType, contentId } = body;

    if (!contentType || !contentId) {
      return NextResponse.json(
        { error: 'contentType and contentId are required' },
        { status: 400 }
      );
    }

    // Use separate conditional branches instead of union type
    let content: any;
    if (contentType === 'blog') {
      content = await Blog.findById(contentId);
    } else {
      content = await Preparation.findById(contentId);
    }

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // For anonymous users, use a generic identifier
    const userId = session?.user?.id || 'anonymous';
    const userName = session?.user?.name || session?.user?.email || 'Anonymous User';
    const userEmail = session?.user?.email || '';

    // Check if user already has a pending request (for logged-in users only)
    if (session?.user?.id) {
      const existingRequest = content.publishRequests?.find(
        (req: any) => req.userId.toString() === session.user.id && req.status === 'pending'
      );

      if (existingRequest) {
        return NextResponse.json(
          { error: 'You already have a pending publish request for this content' },
          { status: 400 }
        );
      }
    }

    // Add publish request
    if (!content.publishRequests) {
      content.publishRequests = [];
    }

    content.publishRequests.push({
      userId,
      userName,
      userEmail,
      status: 'pending',
      requestedAt: new Date(),
    });

    await content.save();

    return NextResponse.json({
      message: 'Publish request submitted successfully',
      content,
    });
  } catch (error) {
    console.error('Publish request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit publish request' },
      { status: 500 }
    );
  }
}

// GET: List all publish requests (admin only)
export async function GET(req: NextRequest) {
  try {
    const adminAuth = await isAdmin(req);
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [blogs, preparations] = await Promise.all([
      Blog.find({ 'publishRequests.0': { $exists: true } })
        .select('title slug publishRequests')
        .lean(),
      Preparation.find({ 'publishRequests.0': { $exists: true } })
        .select('topic slug publishRequests')
        .lean(),
    ]);

    return NextResponse.json({
      blogs,
      preparations,
    });
  } catch (error) {
    console.error('Fetch publish requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publish requests' },
      { status: 500 }
    );
  }
}

// PATCH: Approve or reject a publish request (admin only)
export async function PATCH(req: NextRequest) {
  try {
    const adminAuth = await isAdmin(req);
    if (!adminAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const session = await auth();
    const body = await req.json();
    const { contentType, contentId, requestUserId, action } = body;

    if (!contentType || !contentId || !requestUserId || !action) {
      return NextResponse.json(
        { error: 'contentType, contentId, requestUserId, and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Use separate conditional branches
    let content: any;
    if (contentType === 'blog') {
      content = await Blog.findById(contentId);
    } else {
      content = await Preparation.findById(contentId);
    }

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const requestIndex = content.publishRequests?.findIndex(
      (req: any) => req.userId.toString() === requestUserId && req.status === 'pending'
    );

    if (requestIndex === -1 || requestIndex === undefined) {
      return NextResponse.json(
        { error: 'Publish request not found' },
        { status: 404 }
      );
    }

    // Update request status
    content.publishRequests[requestIndex].status = action === 'approve' ? 'approved' : 'rejected';
    content.publishRequests[requestIndex].resolvedAt = new Date();
    content.publishRequests[requestIndex].resolvedBy = session?.user?.id;

    // If approved, also publish the content
    if (action === 'approve') {
      content.published = true;
    }

    await content.save();

    return NextResponse.json({
      message: `Publish request ${action}d successfully`,
      content,
    });
  } catch (error) {
    console.error('Update publish request error:', error);
    return NextResponse.json(
      { error: 'Failed to update publish request' },
      { status: 500 }
    );
  }
}
