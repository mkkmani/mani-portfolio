import { getAbsoluteUrl } from './seo-config';

/**
 * Google Indexing API configuration and utilities
 * 
 * Setup Instructions:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com)
 * 2. Create a new project or select existing
 * 3. Enable "Indexing API" and "Web Search Indexing API"
 * 4. Create a Service Account
 * 5. Download the JSON key file
 * 6. Add the service account email to Google Search Console (Settings > Users and permissions)
 * 7. Set GOOGLE_INDEXING_CREDENTIALS environment variable with the JSON content
 * 
 * @see https://developers.google.com/search/apis/indexing-api/v3/quickstart
 */

interface GoogleIndexingCredentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface IndexingResponse {
  success: boolean;
  message: string;
  urlNotification?: {
    url: string;
    type: 'URL_UPDATED' | 'URL_DELETED';
    notifyTime?: string;
  };
  error?: string;
}

/**
 * Get Google Indexing API credentials from environment
 */
function getCredentials(): GoogleIndexingCredentials | null {
  try {
    const credentialsJson = process.env.GOOGLE_INDEXING_CREDENTIALS;

    if (!credentialsJson) {
      console.log('[Google Indexing API] Credentials not found. Set GOOGLE_INDEXING_CREDENTIALS environment variable to enable automatic indexing.');
      return null;
    }

    return JSON.parse(credentialsJson) as GoogleIndexingCredentials;
  } catch (error) {
    console.error('[Google Indexing API] Error parsing credentials:', error);
    return null;
  }
}

/**
 * Get OAuth2 access token for Google Indexing API using JWT authentication
 * Uses Node.js built-in crypto module for production-ready JWT signing
 */
async function getAccessToken(credentials: GoogleIndexingCredentials): Promise<string | null> {
  try {
    const crypto = await import('crypto');

    // Create JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      exp: now + 3600,
      iat: now
    };

    // Base64URL encode header and payload
    const base64UrlEncode = (str: string): string => {
      return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Sign with RSA-SHA256
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    sign.end();

    const signature = sign.sign(credentials.private_key, 'base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const jwt = `${signatureInput}.${signature}`;

    // Exchange JWT for access token
    const response = await fetch('https://www.googleapis.com/oauth2/v4/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Google Indexing API] Failed to get access token:', error);
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('[Google Indexing API] Error getting access token:', error);
    return null;
  }
}

/**
 * Notify Google about a new or updated URL
 * 
 * @param {string} url - The absolute URL to notify Google about
 * @param {string} type - 'URL_UPDATED' or 'URL_DELETED'
 * @returns {Promise<IndexingResponse>}
 */
export async function notifyGoogleIndexing(
  url: string,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<IndexingResponse> {
  try {
    const credentials = getCredentials();

    if (!credentials) {
      return {
        success: false,
        message: 'Google Indexing API not configured. Content will be indexed through normal crawling.',
        error: 'CREDENTIALS_NOT_FOUND'
      };
    }

    const accessToken = await getAccessToken(credentials);

    if (!accessToken) {
      return {
        success: false,
        message: 'Failed to authenticate with Google Indexing API',
        error: 'AUTH_FAILED'
      };
    }

    // Send indexing request
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        url,
        type
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Google Indexing API] Notification failed:', error);

      return {
        success: false,
        message: `Failed to notify Google: ${response.statusText}`,
        error: error
      };
    }

    const data = await response.json();

    console.log(`[Google Indexing API] Successfully notified Google about ${url}`);

    return {
      success: true,
      message: `Google notified successfully for ${url}`,
      urlNotification: data
    };
  } catch (error) {
    console.error('[Google Indexing API] Error:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error instanceof Error ? error.toString() : 'UNKNOWN_ERROR'
    };
  }
}

/**
 * Notify Google about a new or updated blog post
 * 
 * @param {string} slug - The blog slug
 * @returns {Promise<IndexingResponse>}
 */
export async function notifyGoogleBlogIndexing(slug: string): Promise<IndexingResponse> {
  const url = getAbsoluteUrl(`/notelogs/${slug}`);
  return notifyGoogleIndexing(url, 'URL_UPDATED');
}

/**
 * Notify Google about a new or updated interview prep page
 * 
 * @param {string} slug - The preparation slug
 * @returns {Promise<IndexingResponse>}
 */
export async function notifyGooglePrepIndexing(slug: string): Promise<IndexingResponse> {
  const url = getAbsoluteUrl(`/interview-prep/${slug}`);
  return notifyGoogleIndexing(url, 'URL_UPDATED');
}

/**
 * Notify Google to remove a URL from index
 * 
 * @param {string} url - The absolute URL to remove
 * @returns {Promise<IndexingResponse>}
 */
export async function notifyGoogleUrlRemoval(url: string): Promise<IndexingResponse> {
  return notifyGoogleIndexing(url, 'URL_DELETED');
}

/**
 * Batch notify Google about multiple URLs
 * 
 * @param {string[]} urls - Array of absolute URLs
 * @param {string} type - 'URL_UPDATED' or 'URL_DELETED'
 * @returns {Promise<IndexingResponse[]>}
 */
export async function batchNotifyGoogleIndexing(
  urls: string[],
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<IndexingResponse[]> {
  console.log(`[Google Indexing API] Batch notifying ${urls.length} URLs`);

  // Process in batches to avoid rate limiting
  const results: IndexingResponse[] = [];

  for (const url of urls) {
    const result = await notifyGoogleIndexing(url, type);
    results.push(result);

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}
