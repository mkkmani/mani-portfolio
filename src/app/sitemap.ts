import { ENV_CONFIG } from "@/config/envConfig";
import { MetadataRoute } from "next";
import { getNotelogs as getNotelogsFromDB } from "@/server/services/noteLogServices";
import connectToDB from "@/server/db/mongoDb";

async function getNotelogs() {
  try {
    await connectToDB();
    const data = await getNotelogsFromDB();
    return data || [];
  } catch (error) {
    console.error("Error fetching notelogs:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = ENV_CONFIG.NEXT_PUBLIC_APP_URL || 'https://manikantaketha.in';
  const currentDate = new Date();

  const notelogs = await getNotelogs();

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notelogs`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  const notelogRoutes = notelogs.map(
    (notelog: { slug: string; updatedAt?: string }) => ({
      url: `${baseUrl}/notelogs/${notelog.slug}`,
      lastModified: notelog.updatedAt
        ? new Date(notelog.updatedAt)
        : currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...notelogRoutes];
}
