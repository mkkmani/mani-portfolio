import { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/seo-config';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import Preparation from '@/server/models/Preparation';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url;

  const routes = [
    { path: '', changeFreq: 'weekly' as const, priority: 1 },
    { path: '/projects', changeFreq: 'monthly' as const, priority: 0.9 },
    { path: '/contact', changeFreq: 'yearly' as const, priority: 0.5 },
    { path: '/notelogs', changeFreq: 'daily' as const, priority: 0.8 },
    { path: '/interview-prep', changeFreq: 'daily' as const, priority: 0.8 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .select('slug updatedAt createdAt')
      .sort({ updatedAt: -1 });

    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/notelogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
  }

  let preparationRoutes: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const preparations = await Preparation.find({ published: true })
      .select('slug updatedAt createdAt')
      .sort({ updatedAt: -1 });

    preparationRoutes = preparations.map((prep) => ({
      url: `${baseUrl}/interview-prep/${prep.slug}`,
      lastModified: prep.updatedAt || prep.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating preparation sitemap:', error);
  }

  return [...routes, ...blogRoutes, ...preparationRoutes];
}
