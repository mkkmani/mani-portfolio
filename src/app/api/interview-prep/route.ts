import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

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
      const preparation = await Preparation.findOne({ slug });
      if (!preparation) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }
      if (!preparation.published && !isAdmin) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }
      return NextResponse.json(preparation);
    }

    if (isAdmin) {
      const preparations = await Preparation.find({}).sort({ createdAt: -1 });
      return NextResponse.json(preparations);
    }

    const filter = { published: true };
    const preparations = await Preparation.find(filter).sort({ createdAt: -1 });

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
    console.error('Create preparation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, published, feedback, messageIndex } = body;
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

    if (feedback !== undefined && messageIndex !== undefined) {
      const preparation = await Preparation.findById(_id);
      if (!preparation) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      if (preparation.messages[messageIndex]) {
        preparation.messages[messageIndex].feedback = feedback;
        await preparation.save();
        return NextResponse.json(preparation);
      } else {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  } catch (error) {
    console.error('Update preparation error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
