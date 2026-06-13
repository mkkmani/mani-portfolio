import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/server/db";
import Blog from "@/server/models/Blog";
import { verifyAdminRequest } from "@/lib/verify-admin";
import { pick, makeSlug, isValidObjectId } from "@/lib/validation";
import { revalidateContent } from "@/lib/cache";
import { notifyGoogleBlogIndexing } from "@/lib/google-indexing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CREATE_FIELDS = ["title", "excerpt", "content", "image", "tags", "customDate"] as const;
const LIST_FIELDS = "title slug excerpt image tags published favourite discarded createdAt updatedAt";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("all") === "true";
    const isAdmin = await verifyAdminRequest(req);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9", 10)));
    const skip = (page - 1) * limit;

    const filter = isAdmin && showAll ? {} : { published: true, discarded: { $ne: true } };

    if (isAdmin && showAll) {
      const blogs = await Blog.find(filter)
        .select(LIST_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
      return NextResponse.json(blogs);
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter).select(LIST_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      data: blogs,
      pagination: { total, totalPages, currentPage: page, limit, hasMore: page < totalPages },
    });
  } catch (error) {
    console.error("Fetch blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const data = pick(body, CREATE_FIELDS);

    if (!data.title || !data.excerpt || !data.content) {
      return NextResponse.json(
        { error: "title, excerpt and content are required" },
        { status: 400 }
      );
    }

    const blog = await Blog.create({ ...data, slug: makeSlug(data.title) });
    revalidateContent("blog", blog.slug);
    return NextResponse.json(
      { success: true, message: "Blog created successfully", slug: blog.slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { _id, published, favourite } = body;

    if (!isValidObjectId(_id)) {
      return NextResponse.json({ error: "Valid blog ID is required" }, { status: 400 });
    }

    const updateData: { published?: boolean; favourite?: boolean } = {};
    if (published !== undefined) updateData.published = !!published;
    if (favourite !== undefined) updateData.favourite = !!favourite;

    const blog = await Blog.findByIdAndUpdate(_id, updateData, { new: true });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Any state change (publish / unpublish / favourite) invalidates caches.
    revalidateContent("blog", blog.slug);

    if (published === true && blog.slug) {
      notifyGoogleBlogIndexing(blog.slug).catch((err) =>
        console.error("[SEO] Google indexing error:", err)
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
