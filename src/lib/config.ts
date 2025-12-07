export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_please_change'
);

export const MONGODB_URI = process.env.MONGODB_URI || '';

export const SMTP_CONFIG = {
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || '',
} as const;

export const APP_CONFIG = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
export const COOKIE_CONFIG = {
  name: 'admin-token',
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
  maxAge: 60 * 60,
} as const;

export const TOKEN_CONFIG = {
  expirationTime: '60m',
} as const;


export const SOCIAL_LINKS = {
  github: process.env.NEXT_PUBLIC_GITHUB_LINK || '',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_LINK || '',
  twitter: process.env.NEXT_PUBLIC_TWITTER_LINK || '',
  email: process.env.NEXT_PUBLIC_PERSONAL_EMAIL || '',
} as const;

export function getAppUrl(): string {
  if (typeof window === 'undefined') {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    return process.env.VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : 'http://localhost:3000';
  }

  return window.location.origin;
}
