import { NextRequest, NextResponse } from 'next/server';
import { revalidateSitemap } from '@/lib/revalidate-sitemap';
import { jwtVerify } from 'jose';
import { JWT_SECRET, COOKIE_CONFIG } from '@/lib/config';

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
 * API endpoint to manually trigger sitemap revalidation
 * 
 * POST /api/revalidate-sitemap
 * 
 * This endpoint can be called manually or automatically after bulk content updates
 * to ensure the sitemap includes all published content.
 * 
 * @requires Admin authentication
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

    const result = await revalidateSitemap();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Sitemap revalidated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Error in sitemap revalidation:', error);

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
 * GET endpoint to check sitemap revalidation status
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

  return NextResponse.json({
    message: 'Sitemap is auto-revalidated every 12 hours via ISR',
    info: 'Use POST request to manually trigger revalidation',
    endpoint: '/api/revalidate-sitemap',
    documentation: 'Sitemap also updates automatically when you publish content'
  });
}
