import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/seo-config';
import { getPublishedBlogSlugs } from '@/lib/data/blogs';
import { getPublishedPreparationSlugs } from '@/lib/data/preparations';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const isCIBuild = process.env.CI === 'true' || process.env.MONGODB_URI?.includes('dummy');

  const routes = [
    { path: '', changeFreq: 'daily' as const, priority: 1.0 },
    { path: '/about', changeFreq: 'monthly' as const, priority: 0.9 },
    { path: '/work', changeFreq: 'weekly' as const, priority: 0.9 },
    { path: '/projects', changeFreq: 'weekly' as const, priority: 0.9 },
    { path: '/notelogs', changeFreq: 'daily' as const, priority: 0.9 },
    { path: '/interview-prep', changeFreq: 'daily' as const, priority: 1.0 },
    { path: '/contact', changeFreq: 'monthly' as const, priority: 0.8 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  if (isCIBuild) return routes;

  let blogRoutes: MetadataRoute.Sitemap = [];
  let preparationRoutes: MetadataRoute.Sitemap = [];

  try {
    const [blogs, preparations] = await Promise.all([
      getPublishedBlogSlugs(),
      getPublishedPreparationSlugs(),
    ]);

    blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/notelogs/${b.slug}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    preparationRoutes = preparations.map((p) => ({
      url: `${baseUrl}/interview-prep/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...routes, ...blogRoutes, ...preparationRoutes];
}
