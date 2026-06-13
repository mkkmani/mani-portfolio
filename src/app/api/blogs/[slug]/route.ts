import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { auth } from '@/lib/auth';
import { verifyAdminCookies } from '@/lib/verify-admin';
import { pick } from '@/lib/validation';
import { revalidateContent } from '@/lib/cache';

const UPDATE_FIELDS = ['title', 'excerpt', 'content', 'image', 'tags', 'customDate'] as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug }).lean();

  if (!blog) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  if (!blog.published) {
    const isAdmin = await verifyAdminCookies();
    const session = await auth();
    const isOwner = session?.user?.id && blog.userId?.toString() === session.user.id;
    const canAccess = isAdmin || isOwner;

    if (!canAccess) {
      // Never leak the draft body to anonymous viewers - strip content/requests.
      const { content, publishRequests, ...safe } = blog;
      void content;
      void publishRequests;
      return NextResponse.json({
        ...safe,
        userRole: 'viewer',
        canPublish: false,
        canRequestPublish: true,
        hasPublishRequest: (blog.publishRequests?.length ?? 0) > 0,
      });
    }

    return NextResponse.json({
      ...blog,
      userRole: isAdmin ? 'admin' : 'owner',
      canPublish: isAdmin,
      canRequestPublish: isOwner,
      hasPublishRequest: (blog.publishRequests?.length ?? 0) > 0,
      publishRequestStatus: blog.publishRequests?.[0]?.status,
    });
  }

  return NextResponse.json(blog);
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await verifyAdminCookies())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { slug } = await params;
    const body = await req.json();
    const update = pick(body, UPDATE_FIELDS);

    const blog = await Blog.findOneAndUpdate({ slug }, update, { new: true });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    revalidateContent('blog', blog.slug);
    return NextResponse.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// DELETE: Discard (soft) or permanently delete a blog (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    if (!(await verifyAdminCookies())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { slug } = await params;
    const deleteType = new URL(req.url).searchParams.get('type');

    if (!deleteType || !['discard', 'permanent'].includes(deleteType)) {
      return NextResponse.json(
        { error: 'type must be either "discard" or "permanent"' },
        { status: 400 }
      );
    }

    const blog =
      deleteType === 'discard'
        ? await Blog.findOneAndUpdate({ slug }, { discarded: true }, { new: true })
        : await Blog.findOneAndDelete({ slug });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    revalidateContent('blog', slug);
    return NextResponse.json({
      message: deleteType === 'discard' ? 'Blog discarded successfully' : 'Blog permanently deleted',
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
