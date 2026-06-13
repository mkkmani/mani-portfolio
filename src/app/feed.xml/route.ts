import { NextResponse } from 'next/server';
import { getPublishedBlogs } from '@/lib/data/blogs';
import { getSiteConfig } from '@/lib/seo-config';
import { escapeXml, safeCdata } from '@/lib/escape';

export const revalidate = 3600;

export async function GET() {
  try {
    const config = getSiteConfig();
    const { data: blogs } = await getPublishedBlogs(1, 50);

    const items = blogs
      .map(
        (blog) => `
    <item>
      <title><![CDATA[${safeCdata(blog.title)}]]></title>
      <link>${escapeXml(`${config.url}/notelogs/${blog.slug}`)}</link>
      <guid isPermaLink="true">${escapeXml(`${config.url}/notelogs/${blog.slug}`)}</guid>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${safeCdata(blog.excerpt)}]]></description>
    </item>`
      )
      .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${escapeXml(config.url)}</link>
    <description>${escapeXml(config.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${config.url}/feed.xml`)}" rel="self" type="application/rss+xml" />${items}
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
