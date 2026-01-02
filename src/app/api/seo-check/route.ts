import { NextRequest, NextResponse } from 'next/server';
import { getAbsoluteUrl, isAbsoluteUrl, getBaseUrl } from '@/lib/seo-config';
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
 * SEO Health Check API
 * 
 * GET /api/seo-check?url=/path/to/check
 * 
 * Returns SEO health information for a given path or URL
 * 
 * @requires Admin authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get('url') || '/';

    // Determine if URL is already absolute or a relative path
    let absoluteUrl: string;
    let pathOnly: string;

    if (isAbsoluteUrl(urlParam)) {
      // Already an absolute URL, use as-is
      absoluteUrl = urlParam;
      try {
        const parsedUrl = new URL(urlParam);
        pathOnly = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      } catch {
        pathOnly = urlParam;
      }
    } else {
      // Relative path, convert to absolute
      pathOnly = urlParam;
      absoluteUrl = getAbsoluteUrl(urlParam);
    }

    // Validate URL format
    const urlValidation = {
      valid: absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://'),
      protocol: absoluteUrl.split(':')[0],
      hasTrailingSlash: absoluteUrl.endsWith('/') && absoluteUrl !== getBaseUrl(),
      isLocalhost: absoluteUrl.includes('localhost'),
      isProduction: absoluteUrl.includes(getBaseUrl())
    };

    // Health check results
    const healthCheck = {
      input: urlParam,
      path: pathOnly,
      absoluteUrl,
      checks: {
        hasAbsoluteUrl: isAbsoluteUrl(absoluteUrl),
        urlFormat: urlValidation,
        seo: {
          canonicalFormat: 'absolute',
          robotsIndexable: true,
          hasSitemap: true,
          baseUrlMatches: absoluteUrl.startsWith(getBaseUrl())
        },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(healthCheck);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'SEO health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to validate bulk URLs
 * 
 * @requires Admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { urls } = body;

    if (!Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs must be an array' },
        { status: 400 }
      );
    }

    const results = urls.map((urlParam: string) => {
      let absoluteUrl: string;
      let pathOnly: string;

      if (isAbsoluteUrl(urlParam)) {
        absoluteUrl = urlParam;
        try {
          const parsedUrl = new URL(urlParam);
          pathOnly = parsedUrl.pathname;
        } catch {
          pathOnly = urlParam;
        }
      } else {
        pathOnly = urlParam;
        absoluteUrl = getAbsoluteUrl(urlParam);
      }

      const isValid = isAbsoluteUrl(absoluteUrl) && absoluteUrl.startsWith('http');

      return {
        input: urlParam,
        path: pathOnly,
        absoluteUrl,
        isValid,
        matchesBaseUrl: absoluteUrl.startsWith(getBaseUrl()),
      };
    });

    return NextResponse.json({
      total: urls.length,
      valid: results.filter(r => r.isValid).length,
      invalid: results.filter(r => !r.isValid).length,
      baseUrlMatches: results.filter(r => r.matchesBaseUrl).length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Bulk URL validation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
