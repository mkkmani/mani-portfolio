import { NextResponse } from 'next/server';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import { getSiteConfig } from '@/lib/seo-config';

export async function GET() {
  try {
    await dbConnect();
    const config = getSiteConfig();
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.title}</title>
    <link>${config.url}</link>
    <description>${config.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${config.url}/feed.xml" rel="self" type="application/rss+xml" />
    ${blogs
        .map(
          (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${config.url}/notelogs/${blog.slug}</link>
      <guid isPermaLink="true">${config.url}/notelogs/${blog.slug}</guid>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${blog.excerpt}]]></description>
    </item>`
        )
        .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}
