import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Project from '@/server/models/Project';
import { verifyAdminRequest } from '@/lib/verify-admin';
import { pick, isValidObjectId } from '@/lib/validation';
import { revalidateContent } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CREATE_FIELDS = ['title', 'description', 'image', 'link', 'github', 'tags'] as const;

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const showAll = new URL(req.url).searchParams.get('all') === 'true';
    const isAdmin = await verifyAdminRequest(req);

    const filter = isAdmin && showAll ? {} : { published: true };
    const projects = await Project.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const data = pick(body, CREATE_FIELDS);

    if (!data.title || !data.description || !data.image) {
      return NextResponse.json(
        { error: 'title, description and image are required' },
        { status: 400 }
      );
    }

    const project = await Project.create(data);
    revalidateContent('project');
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { _id, published, favourite } = body;

    if (!isValidObjectId(_id)) {
      return NextResponse.json({ error: 'Valid project ID is required' }, { status: 400 });
    }

    const updateData: { published?: boolean; favourite?: boolean } = {};
    if (published !== undefined) updateData.published = !!published;
    if (favourite !== undefined) updateData.favourite = !!favourite;

    const project = await Project.findByIdAndUpdate(_id, updateData, { new: true });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    revalidateContent('project');
    return NextResponse.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
