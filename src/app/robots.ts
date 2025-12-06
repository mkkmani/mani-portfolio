import { MetadataRoute } from 'next';
import { getSiteConfig } from '@/lib/seo-config';


export default function robots(): MetadataRoute.Robots {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/get-access', '/api/*'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
