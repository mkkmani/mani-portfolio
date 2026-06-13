import "server-only";
import { unstable_cache } from "next/cache";
import dbConnect from "@/server/db";
import Preparation from "@/server/models/Preparation";
import { IPreparation, IMessage } from "@/services/api/preparation";
import { CACHE_TAGS } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/config";
import { serialize } from "./serialize";

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Normalize a raw preparation doc to the shape the UI expects. Bridges the
 * legacy storage (transcript under `preparationData.practicalExamples`,
 * lowercase difficulty, no `title`) to the canonical `messages` + `title`.
 */
function normalize(doc: Record<string, unknown>): IPreparation {
  const d = serialize(doc) as Record<string, unknown>;
  const prepData = (d.preparationData ?? {}) as { practicalExamples?: IMessage[] };
  const messages =
    (Array.isArray(d.messages) && d.messages.length
      ? (d.messages as IMessage[])
      : prepData.practicalExamples) ?? [];
  return {
    ...(d as unknown as IPreparation),
    title: (d.topic as string) ?? "",
    difficulty: cap((d.difficulty as string) ?? "intermediate") as IPreparation["difficulty"],
    messages,
  };
}

const LIST_FIELDS = "topic slug excerpt difficulty published categories createdAt updatedAt";

/** Published preparations, paginated (list view excludes transcripts). */
export const getPublishedPreparations = unstable_cache(
  async (page = 1, limit = 9) => {
    await dbConnect();
    const filter = { published: true, discarded: { $ne: true } };
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      Preparation.find(filter).select(LIST_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Preparation.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: docs.map((d) => normalize(d as unknown as Record<string, unknown>)),
      pagination: { total, totalPages, currentPage: page, limit, hasMore: page < totalPages },
    };
  },
  ["preparations-published"],
  { tags: [CACHE_TAGS.preparations], revalidate: CACHE_TTL.list }
);

/** A single published preparation by slug (full transcript). */
export function getPublishedPreparationBySlug(slug: string): Promise<IPreparation | null> {
  return unstable_cache(
    async (): Promise<IPreparation | null> => {
      await dbConnect();
      const doc = await Preparation.findOne({ slug, published: true, discarded: { $ne: true } }).lean();
      return doc ? normalize(doc as unknown as Record<string, unknown>) : null;
    },
    ["preparation-by-slug", slug],
    { tags: [CACHE_TAGS.preparations, CACHE_TAGS.preparation(slug)], revalidate: CACHE_TTL.detail }
  )();
}

/** Slugs for generateStaticParams / sitemap. */
export const getPublishedPreparationSlugs = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    await dbConnect();
    const docs = await Preparation.find({ published: true, discarded: { $ne: true } })
      .select("slug updatedAt")
      .sort({ updatedAt: -1 })
      .lean();
    return serialize(docs) as unknown as { slug: string; updatedAt: string }[];
  },
  ["preparations-slugs"],
  { tags: [CACHE_TAGS.preparations], revalidate: CACHE_TTL.feed }
);
