import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const showAll = searchParams.get('all') === 'true';
    const isAdmin = await verifyAdmin(req);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);

    if (isAdmin && showAll) {
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      return NextResponse.json(blogs);
    }
    const filter = { published: true };

    const total = await Blog.countDocuments(filter);

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      data: blogs,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (body.slug) {
      const randomString = Math.random().toString(36).substring(2, 8);
      const uniqueId = `${Date.now()}-${randomString}`;
      body.slug = `${body.slug}-${uniqueId}`;
    } else if (body.title) {
      let baseSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const randomString = Math.random().toString(36).substring(2, 8);
      const uniqueId = `${Date.now()}-${randomString}`;

      body.slug = `${baseSlug}-${uniqueId}`;
    }
    await Blog.create(body);
    return NextResponse.json({ success: true, message: 'Blog created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { _id, published, favourite } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (published !== undefined) updateData.published = published;
    if (favourite !== undefined) updateData.favourite = favourite;

    const blog = await Blog.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}
