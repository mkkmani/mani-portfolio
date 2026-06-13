import "server-only";
import { unstable_cache } from "next/cache";
import { getPublishedBlogs } from "@/lib/data/blogs";
import { getPublishedProjects } from "@/lib/data/projects";
import { getPublishedPreparations } from "@/lib/data/preparations";
import { CACHE_TAGS } from "@/lib/cache";
import { SITE_ROUTES } from "./persona";

const MAX_BLOGS = 40;
const MAX_PREPS = 40;
const MAX_PROJECTS = 40;

function clip(text: string | undefined, max = 160): string {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

/**
 * Builds the live content catalog the assistant can talk about: every published
 * blog, project and interview-prep topic, each with its exact internal link so
 * the model can hand visitors working in-site URLs (never external ones).
 *
 * Cached cross-request and tagged with the same cache tags as the underlying
 * content, so publishing/editing invalidates it automatically.
 */
export const buildAssistantContext = unstable_cache(
  async (): Promise<string> => {
    const [blogsRes, projects, prepsRes] = await Promise.all([
      getPublishedBlogs(1, MAX_BLOGS),
      getPublishedProjects(),
      getPublishedPreparations(1, MAX_PREPS),
    ]);

    // Pre-format each item as a ready-to-use markdown link so the model can
    // copy it verbatim - this is the single biggest lever for getting clean,
    // clickable links in the chat instead of bare paths.
    const meta = (tags?: string[]) =>
      tags?.length ? ` (tags: ${tags.slice(0, 5).join(", ")})` : "";

    const blogs = blogsRes.data
      .map(
        (b) =>
          `- [${b.title}](${SITE_ROUTES.notelogs}/${b.slug}) - ${clip(
            b.excerpt
          )}${meta(b.tags)}`
      )
      .join("\n");

    const preps = prepsRes.data
      .slice(0, MAX_PREPS)
      .map(
        (p) =>
          `- [${p.topic}](${SITE_ROUTES.interviewPrep}/${p.slug}) - ${p.difficulty
          }${p.excerpt ? `, ${clip(p.excerpt)}` : ""}`
      )
      .join("\n");

    // Projects are a gallery with no per-item detail page → all link to /projects.
    const projectList = projects
      .slice(0, MAX_PROJECTS)
      .map(
        (p) =>
          `- [${p.title}](${SITE_ROUTES.projects}) - ${clip(p.description)}${meta(
            p.tags
          )}`
      )
      .join("\n");

    return `
# Live site content (only reference items that appear below)

## Notelogs / blog posts (${blogsRes.data.length})
${blogs || "No published posts yet."}

## Interview-prep topics (${prepsRes.data.length})
${preps || "No published interview-prep topics yet."}

## Projects (${projects.length})
${projectList || "No published projects yet."}
`.trim();
  },
  ["assistant-context"],
  {
    tags: [CACHE_TAGS.blogs, CACHE_TAGS.projects, CACHE_TAGS.preparations],
    revalidate: 300,
  }
);
