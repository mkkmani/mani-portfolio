import { revalidateTag, revalidatePath } from "next/cache";

export const CACHE_TAGS = {
  blogs: "blogs",
  blog: (slug: string) => `blog:${slug}`,
  projects: "projects",
  preparations: "preparations",
  preparation: (slug: string) => `prep:${slug}`,
} as const;

type ContentType = "blog" | "preparation" | "project";

const purge = (tag: string) => revalidateTag(tag, "max");

export function revalidateContent(type: ContentType, slug?: string): void {
  switch (type) {
    case "blog":
      purge(CACHE_TAGS.blogs);
      if (slug) {
        purge(CACHE_TAGS.blog(slug));
        revalidatePath(`/notelogs/${slug}`);
      }
      revalidatePath("/notelogs");
      revalidatePath("/feed.xml");
      break;
    case "preparation":
      purge(CACHE_TAGS.preparations);
      if (slug) {
        purge(CACHE_TAGS.preparation(slug));
        revalidatePath(`/interview-prep/${slug}`);
      }
      revalidatePath("/interview-prep");
      break;
    case "project":
      purge(CACHE_TAGS.projects);
      revalidatePath("/work");
      revalidatePath("/projects");
      break;
  }
  // Landing page surfaces featured items from every collection.
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}
