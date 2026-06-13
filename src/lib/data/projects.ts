import "server-only";
import { unstable_cache } from "next/cache";
import dbConnect from "@/server/db";
import Project from "@/server/models/Project";
import { IProject } from "@/types/api";
import { CACHE_TAGS } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/config";
import { serialize } from "./serialize";

/** All published projects, newest first. */
export const getPublishedProjects = unstable_cache(
  async (): Promise<IProject[]> => {
    await dbConnect();
    const docs = await Project.find({ published: true }).sort({ createdAt: -1 }).lean();
    return serialize(docs) as unknown as IProject[];
  },
  ["projects-published"],
  { tags: [CACHE_TAGS.projects], revalidate: CACHE_TTL.list }
);

/** Featured (favourite + published) projects for the landing page. */
export const getFeaturedProjects = unstable_cache(
  async (limit = 3): Promise<IProject[]> => {
    await dbConnect();
    const docs = await Project.find({ published: true, favourite: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return serialize(docs) as unknown as IProject[];
  },
  ["projects-featured"],
  { tags: [CACHE_TAGS.projects], revalidate: CACHE_TTL.list }
);
