export const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_please_change'
);

export const MONGODB_URI = process.env.MONGODB_URI || '';

export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.unosend.co',
  port: parseInt(process.env.SMTP_PORT || '587'),
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


const OPENROUTER_MODELS = [
  'google/gemma-3-27b-it:free',
  'mistralai/devstral-2512:free',
  'xiaomi/mimo-v2-flash:free',
] as const;

export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || '',
  models: OPENROUTER_MODELS,
  model: process.env.USE_CUSTOM_AI_MODEL ? process.env.CUSTOM_AI_MODEL : OPENROUTER_MODELS[process.env.DEFAULT_MODEL_INDEX as keyof typeof OPENROUTER_MODELS] || OPENROUTER_MODELS[0],
} as const;

export const OAUTH_CONFIG = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
} as const;

export const NEXTAUTH_CONFIG = {
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  secret: process.env.NEXTAUTH_SECRET || '',
} as const;
