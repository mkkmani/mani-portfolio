import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get(COOKIE_CONFIG.name)?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const isAdmin = await verifyAdmin(req);

    if (slug) {
      const preparation = await Preparation.findOne({ slug }).lean();
      if (!preparation) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }

      const session = await auth();
      const isOwner = session?.user?.id && preparation.userId?.toString() === session.user.id;

      const canAccess = preparation.published || isOwner || isAdmin;

      if (!canAccess) {
        // Return limited info for unauthorized users instead of 404
        return NextResponse.json({
          ...preparation,
          userRole: 'viewer',
          canPublish: false,
          canRequestPublish: true, // Anyone can request publish
          hasPublishRequest: (preparation.publishRequests?.length ?? 0) > 0,
          publishRequestStatus: preparation.publishRequests?.[0]?.status,
        });
      }

      // Determine user role and permissions
      let userRole: 'admin' | 'owner' | 'viewer' = 'viewer';
      if (isAdmin) userRole = 'admin';
      else if (isOwner) userRole = 'owner';

      return NextResponse.json({
        ...preparation,
        userRole,
        canPublish: isAdmin,
        canRequestPublish: isOwner && !preparation.published,
        hasPublishRequest: (preparation.publishRequests?.length ?? 0) > 0,
        publishRequestStatus: preparation.publishRequests?.[0]?.status,
      });
    }

    if (isAdmin) {
      const preparations = await Preparation.find({})
        .sort({ published: 1, createdAt: -1 })
        .lean();
      return NextResponse.json(preparations);
    }

    const preparations = await Preparation.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(preparations);
  } catch (error) {
    console.error('Fetch preparation error:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.slug && body.topic) {
      let baseSlug = body.topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const uniqueId = Math.random().toString(36).substring(2, 8);
      body.slug = `${baseSlug}-${uniqueId}`;
    }

    const preparation = await Preparation.create(body);
    return NextResponse.json(preparation, { status: 201 });
  } catch (error) {
    console.error('Toggle publish error:', error);
    return NextResponse.json({ error: 'Failed to toggle publish status' }, { status: 500 });
  }
}

// DELETE: Discard or permanently delete preparation (admin only)
export async function DELETE(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const deleteType = searchParams.get('type'); // 'discard' or 'permanent'

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (!deleteType || !['discard', 'permanent'].includes(deleteType)) {
      return NextResponse.json(
        { error: 'type must be either "discard" or "permanent"' },
        { status: 400 }
      );
    }

    if (deleteType === 'discard') {
      // Soft delete - mark as discarded
      const preparation = await Preparation.findByIdAndUpdate(
        id,
        { discarded: true },
        { new: true }
      );

      if (!preparation) {
        return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Preparation discarded successfully',
        preparation,
      });
    } else {
      // Permanent delete - remove from database
      const preparation = await Preparation.findByIdAndDelete(id);

      if (!preparation) {
        return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Preparation permanently deleted',
      });
    }
  } catch (error) {
    console.error('Delete preparation error:', error);
    return NextResponse.json({ error: 'Failed to delete preparation' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, published } = body;
    const isAdmin = await verifyAdmin(req);

    if (!_id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (published !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const preparation = await Preparation.findByIdAndUpdate(
        _id,
        { published },
        { new: true }
      );
      return NextResponse.json(preparation);
    }

    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  } catch (error) {
    console.error('Update preparation error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
