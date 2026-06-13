import "server-only";
import { unstable_cache } from "next/cache";
import dbConnect from "@/server/db";
import Blog from "@/server/models/Blog";
import { IBlog, IPaginatedResponse } from "@/types/api";
import { CACHE_TAGS } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/config";
import { serialize } from "./serialize";

// Fields needed for cards/lists (excludes the heavy `content` body).
const LIST_FIELDS = "title slug excerpt image tags published favourite createdAt updatedAt";

/**
 * Published blogs, paginated. Cached cross-request and tagged so a publish/edit
 * mutation can invalidate it instantly via revalidateContent("blog").
 */
export const getPublishedBlogs = unstable_cache(
  async (page = 1, limit = 9): Promise<IPaginatedResponse<IBlog>> => {
    await dbConnect();
    const filter = { published: true, discarded: { $ne: true } };
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Blog.find(filter).select(LIST_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: serialize(docs) as unknown as IBlog[],
      pagination: { total, totalPages, currentPage: page, limit, hasMore: page < totalPages },
    };
  },
  ["blogs-published"],
  { tags: [CACHE_TAGS.blogs], revalidate: CACHE_TTL.list }
);

/** Featured (favourite + published) blogs for the landing page. */
export const getFeaturedBlogs = unstable_cache(
  async (limit = 3): Promise<IBlog[]> => {
    await dbConnect();
    const docs = await Blog.find({ published: true, favourite: true, discarded: { $ne: true } })
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return serialize(docs) as unknown as IBlog[];
  },
  ["blogs-featured"],
  { tags: [CACHE_TAGS.blogs], revalidate: CACHE_TTL.list }
);

/** A single published blog by slug (full content). Null when not published. */
export function getPublishedBlogBySlug(slug: string): Promise<IBlog | null> {
  return unstable_cache(
    async (): Promise<IBlog | null> => {
      await dbConnect();
      const doc = await Blog.findOne({ slug, published: true, discarded: { $ne: true } }).lean();
      return doc ? (serialize(doc) as unknown as IBlog) : null;
    },
    ["blog-by-slug", slug],
    { tags: [CACHE_TAGS.blogs, CACHE_TAGS.blog(slug)], revalidate: CACHE_TTL.detail }
  )();
}

/** Slugs for generateStaticParams / sitemap. */
export const getPublishedBlogSlugs = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    await dbConnect();
    const docs = await Blog.find({ published: true, discarded: { $ne: true } })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean();
    return serialize(docs) as unknown as { slug: string; updatedAt: string }[];
  },
  ["blogs-slugs"],
  { tags: [CACHE_TAGS.blogs], revalidate: CACHE_TTL.feed }
);
