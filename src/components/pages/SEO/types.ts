export interface SeoCheckResult {
  input: string;
  path: string;
  absoluteUrl: string;
  checks: {
    hasAbsoluteUrl: boolean;
    urlFormat: {
      valid: boolean;
      protocol: string;
      hasTrailingSlash: boolean;
      isLocalhost: boolean;
      isProduction: boolean;
    };
    seo: {
      canonicalFormat: string;
      robotsIndexable: boolean;
      hasSitemap: boolean;
      baseUrlMatches: boolean;
    };
  };
  timestamp: string;
}

export interface ContentItem {
  slug: string;
  title?: string;
  topic?: string;
  published: boolean;
}

export interface BulkCheckResult {
  total: number;
  valid: number;
  invalid: number;
  baseUrlMatches: number;
  results: {
    input: string;
    path: string;
    absoluteUrl: string;
    isValid: boolean;
    matchesBaseUrl: boolean;
  }[];
}
