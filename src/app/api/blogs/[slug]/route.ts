import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';
import { auth } from '@/lib/auth';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_CONFIG.name)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  if (!blog.published) {
    const isAdmin = await isAuthenticated();
    const session = await auth();
    const isOwner = session?.user?.id && blog.userId?.toString() === session.user.id;

    const canAccess = isAdmin || isOwner;

    if (!canAccess) {
      // Return limited info for unauthorized users
      return NextResponse.json({
        ...blog.toObject(),
        userRole: 'viewer',
        canPublish: false,
        canRequestPublish: true, // Anyone can request publish
        hasPublishRequest: (blog.publishRequests?.length ?? 0) > 0,
        publishRequestStatus: blog.publishRequests?.[0]?.status,
      });
    }

    // Determine user role
    let userRole: 'admin' | 'owner' | 'viewer' = 'viewer';
    if (isAdmin) userRole = 'admin';
    else if (isOwner) userRole = 'owner';

    return NextResponse.json({
      ...blog.toObject(),
      userRole,
      canPublish: isAdmin,
      canRequestPublish: isOwner,
      hasPublishRequest: (blog.publishRequests?.length ?? 0) > 0,
      publishRequestStatus: blog.publishRequests?.[0]?.status,
    });
  }

  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { slug } = await params;
    const body = await req.json();
    const blog = await Blog.findOneAndUpdate({ slug }, body, { new: true });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE: Discard or permanently delete blog (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const deleteType = searchParams.get('type'); // 'discard' or 'permanent'

    if (!deleteType || !['discard', 'permanent'].includes(deleteType)) {
      return NextResponse.json(
        { error: 'type must be either "discard" or "permanent"' },
        { status: 400 }
      );
    }

    if (deleteType === 'discard') {
      // Soft delete - mark as discarded
      const blog = await Blog.findOneAndUpdate(
        { slug },
        { discarded: true },
        { new: true }
      );

      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Blog discarded successfully',
        blog,
      });
    } else {
      // Permanent delete - remove from database
      const blog = await Blog.findOneAndDelete({ slug });

      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }

      return NextResponse.json({
        message: 'Blog permanently deleted',
      });
    }
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
