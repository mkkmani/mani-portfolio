import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';
import { batchNotifyGoogleIndexing } from '@/lib/google-indexing';
import { getAbsoluteUrl } from '@/lib/seo-config';
import dbConnect from '@/server/db';
import Blog from '@/server/models/Blog';
import Preparation from '@/server/models/Preparation';

/**
 * Verify if the request is from an admin user
 */
async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get(COOKIE_CONFIG.name)?.value;
    if (!token) return false;
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

/**
 * API endpoint to manually trigger Google Indexing API notification
 * 
 * POST /api/google-indexing
 * 
 * This endpoint notifies Google about all published content (blogs and interview prep)
 * using the Google Indexing API. Requires Google Indexing API credentials to be
 * configured in the GOOGLE_INDEXING_CREDENTIALS environment variable.
 * 
 * @requires Admin authentication
 * @requires GOOGLE_INDEXING_CREDENTIALS environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Connect to database and fetch all published content
    await dbConnect();

    const [blogs, preparations] = await Promise.all([
      Blog.find({ published: true }).select('slug'),
      Preparation.find({ published: true }).select('slug')
    ]);

    // Build URLs for all published content
    const blogUrls = blogs.map(blog => getAbsoluteUrl(`/notelogs/${blog.slug}`));
    const prepUrls = preparations.map(prep => getAbsoluteUrl(`/interview-prep/${prep.slug}`));
    const allUrls = [...blogUrls, ...prepUrls];

    if (allUrls.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No published content to notify Google about',
        totalUrls: 0,
        successful: 0,
        failed: 0
      });
    }

    // Notify Google about all URLs
    const results = await batchNotifyGoogleIndexing(allUrls, 'URL_UPDATED');

    // Count successful and failed notifications
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Notified Google about ${successful} of ${allUrls.length} URLs`,
      totalUrls: allUrls.length,
      successful,
      failed,
      details: results.map(r => ({
        url: r.url,
        success: r.success,
        message: r.message,
        error: r.error
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Error in Google Indexing notification:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check Google Indexing API status
 * 
 * @requires Admin authentication
 */
export async function GET(request: NextRequest) {
  // Verify admin authentication
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  // Check if credentials are configured
  const hasCredentials = !!process.env.GOOGLE_INDEXING_CREDENTIALS;

  return NextResponse.json({
    configured: hasCredentials,
    message: hasCredentials
      ? 'Google Indexing API is configured and ready to use'
      : 'Google Indexing API not configured. Set GOOGLE_INDEXING_CREDENTIALS environment variable.',
    info: 'Use POST request to notify Google about all published content',
    endpoint: '/api/google-indexing',
    documentation: 'https://developers.google.com/search/apis/indexing-api/v3/quickstart'
  });
}
