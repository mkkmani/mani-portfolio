import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Preparation from '@/server/models/Preparation';
import { auth } from '@/lib/auth';
import { verifyAdminRequest } from '@/lib/verify-admin';
import { pick, makeSlug, isValidObjectId } from '@/lib/validation';
import { revalidateContent } from '@/lib/cache';
import { notifyGooglePrepIndexing } from '@/lib/google-indexing';

export const dynamic = 'force-dynamic';

const CREATE_FIELDS = ['topic', 'difficulty', 'excerpt', 'categories', 'messages'] as const;
const LIST_FIELDS = 'topic slug excerpt difficulty published discarded categories createdAt updatedAt';

function withMessages<T extends { messages?: unknown[]; preparationData?: { practicalExamples?: unknown[] } }>(doc: T) {
  const messages = doc.messages?.length ? doc.messages : doc.preparationData?.practicalExamples ?? [];
  return { ...doc, messages };
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const isAdmin = await verifyAdminRequest(req);

    if (slug) {
      const preparation = await Preparation.findOne({ slug }).lean();
      if (!preparation) {
        return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
      }

      const session = await auth();
      const isOwner = session?.user?.id && preparation.userId?.toString() === session.user.id;
      const canAccess = preparation.published || isOwner || isAdmin;

      if (!canAccess) {
        const { messages, preparationData, publishRequests, ...safe } = preparation;
        void messages;
        void preparationData;
        void publishRequests;
        return NextResponse.json({
          ...safe,
          userRole: 'viewer',
          canPublish: false,
          canRequestPublish: true,
          hasPublishRequest: (preparation.publishRequests?.length ?? 0) > 0,
        });
      }

      return NextResponse.json({
        ...withMessages(preparation),
        userRole: isAdmin ? 'admin' : isOwner ? 'owner' : 'viewer',
        canPublish: isAdmin,
        canRequestPublish: isOwner && !preparation.published,
        hasPublishRequest: (preparation.publishRequests?.length ?? 0) > 0,
        publishRequestStatus: preparation.publishRequests?.[0]?.status,
      });
    }

    const showAll = isAdmin && searchParams.get('all') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const skip = (page - 1) * limit;

    const filter = isAdmin ? {} : { published: true, discarded: { $ne: true } };
    let query = Preparation.find(filter)
      .select(LIST_FIELDS)
      .sort(isAdmin ? { published: 1, createdAt: -1 } : { createdAt: -1 });

    if (!showAll) {
      query = query.skip(skip).limit(limit);
    }

    const preparations = await query.lean();
    return NextResponse.json(preparations);
  } catch (error) {
    console.error('Fetch preparation error:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}

// POST: admin-only manual creation of a preparation.
export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const data = pick(body, CREATE_FIELDS);

    if (!data.topic || !data.difficulty) {
      return NextResponse.json({ error: 'topic and difficulty are required' }, { status: 400 });
    }

    const preparation = await Preparation.create({ ...data, slug: makeSlug(data.topic) });
    revalidateContent('preparation', preparation.slug);
    return NextResponse.json(preparation, { status: 201 });
  } catch (error) {
    console.error('Create preparation error:', error);
    return NextResponse.json({ error: 'Failed to create preparation' }, { status: 500 });
  }
}

// DELETE: Discard (soft) or permanently delete a preparation (admin only)
export async function DELETE(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const deleteType = searchParams.get('type');

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
    }
    if (!deleteType || !['discard', 'permanent'].includes(deleteType)) {
      return NextResponse.json(
        { error: 'type must be either "discard" or "permanent"' },
        { status: 400 }
      );
    }

    const preparation =
      deleteType === 'discard'
        ? await Preparation.findByIdAndUpdate(id, { discarded: true }, { new: true })
        : await Preparation.findByIdAndDelete(id);

    if (!preparation) {
      return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
    }

    revalidateContent('preparation', preparation.slug);
    return NextResponse.json({
      message:
        deleteType === 'discard'
          ? 'Preparation discarded successfully'
          : 'Preparation permanently deleted',
    });
  } catch (error) {
    console.error('Delete preparation error:', error);
    return NextResponse.json({ error: 'Failed to delete preparation' }, { status: 500 });
  }
}

// PATCH: publish toggle (admin) OR message feedback (owner/admin).
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, published, messageIndex, feedback } = body;

    if (!isValidObjectId(_id)) {
      return NextResponse.json({ error: 'Valid ID is required' }, { status: 400 });
    }

    const isAdmin = await verifyAdminRequest(req);

    // --- Publish toggle (admin only) ---
    if (published !== undefined) {
      if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const preparation = await Preparation.findByIdAndUpdate(
        _id,
        { published: !!published },
        { new: true }
      );
      if (!preparation) {
        return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
      }

      revalidateContent('preparation', preparation.slug);
      if (published === true && preparation.slug) {
        notifyGooglePrepIndexing(preparation.slug).catch((err) =>
          console.error('[SEO] Google indexing error:', err)
        );
      }
      return NextResponse.json(preparation);
    }

    // --- Message feedback (owner or admin) ---
    if (feedback !== undefined && typeof messageIndex === 'number') {
      if (!['like', 'dislike', null].includes(feedback)) {
        return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
      }
      const prep = await Preparation.findById(_id);
      if (!prep) {
        return NextResponse.json({ error: 'Preparation not found' }, { status: 404 });
      }

      const session = await auth();
      const isOwner = session?.user?.id && prep.userId?.toString() === session.user.id;
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      if (!prep.messages?.[messageIndex]) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }

      prep.messages[messageIndex].feedback = feedback;
      await prep.save();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid update' }, { status: 400 });
  } catch (error) {
    console.error('Update preparation error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
