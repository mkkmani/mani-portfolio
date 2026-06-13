import { NextRequest, NextResponse } from 'next/server';
import Preparation from '@/server/models/Preparation';
import Blog from '@/server/models/Blog';
import dbConnect from '@/server/db';
import { auth } from '@/lib/auth';
import { verifyAdminRequest } from '@/lib/verify-admin';
import { isValidObjectId } from '@/lib/validation';
import { revalidateContent } from '@/lib/cache';
import type { Document, Model } from 'mongoose';

type ContentType = 'blog' | 'preparation';

interface PublishRequestEntry {
  userId: { toString(): string };
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}
interface PublishableDoc extends Document {
  slug: string;
  published: boolean;
  publishRequests?: PublishRequestEntry[];
}

function modelFor(type: ContentType): Model<PublishableDoc> {
  return (type === 'blog' ? Blog : Preparation) as unknown as Model<PublishableDoc>;
}

// POST: a signed-in user requests publication of their content.
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to request publishing' }, { status: 401 });
    }

    const { contentType, contentId } = await req.json();
    if (!['blog', 'preparation'].includes(contentType) || !isValidObjectId(contentId)) {
      return NextResponse.json(
        { error: 'Valid contentType and contentId are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const content = await modelFor(contentType).findById(contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    content.publishRequests = content.publishRequests || [];
    const existing = content.publishRequests.find(
      (r: { userId: { toString(): string }; status: string }) =>
        r.userId?.toString() === session.user!.id && r.status === 'pending'
    );
    if (existing) {
      return NextResponse.json(
        { error: 'You already have a pending publish request for this content' },
        { status: 400 }
      );
    }

    content.publishRequests.push({
      userId: session.user.id,
      userName: session.user.name || session.user.email || 'User',
      userEmail: session.user.email || '',
      status: 'pending',
      requestedAt: new Date(),
    });
    await content.save();

    return NextResponse.json({ message: 'Publish request submitted successfully' });
  } catch (error) {
    console.error('Publish request error:', error);
    return NextResponse.json({ error: 'Failed to submit publish request' }, { status: 500 });
  }
}

// GET: list all pending publish requests (admin only)
export async function GET(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const [blogs, preparations] = await Promise.all([
      Blog.find({ 'publishRequests.0': { $exists: true } }).select('title slug publishRequests').lean(),
      Preparation.find({ 'publishRequests.0': { $exists: true } }).select('topic slug publishRequests').lean(),
    ]);

    return NextResponse.json({ blogs, preparations });
  } catch (error) {
    console.error('Fetch publish requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch publish requests' }, { status: 500 });
  }
}

// PATCH: approve or reject a publish request (admin only)
export async function PATCH(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const session = await auth();
    const { contentType, contentId, requestUserId, action } = await req.json();

    if (!['blog', 'preparation'].includes(contentType) || !isValidObjectId(contentId) || !requestUserId) {
      return NextResponse.json(
        { error: 'contentType, contentId and requestUserId are required' },
        { status: 400 }
      );
    }
    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
    }

    const content = await modelFor(contentType).findById(contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const request = content.publishRequests?.find(
      (r: { userId: { toString(): string }; status: string }) =>
        r.userId?.toString() === requestUserId && r.status === 'pending'
    );
    if (!request) {
      return NextResponse.json({ error: 'Publish request not found' }, { status: 404 });
    }

    request.status = action === 'approve' ? 'approved' : 'rejected';
    request.resolvedAt = new Date();
    request.resolvedBy = session?.user?.id;
    if (action === 'approve') content.published = true;
    await content.save();

    if (action === 'approve') {
      revalidateContent(contentType === 'blog' ? 'blog' : 'preparation', content.slug);
    }

    return NextResponse.json({ message: `Publish request ${action}d successfully` });
  } catch (error) {
    console.error('Update publish request error:', error);
    return NextResponse.json({ error: 'Failed to update publish request' }, { status: 500 });
  }
}
