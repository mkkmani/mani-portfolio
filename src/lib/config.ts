const jwtSecret = process.env.JWT_SECRET;
if (typeof window === "undefined" && !jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}
export const JWT_SECRET = new TextEncoder().encode(jwtSecret || "");

export const MONGODB_URI = process.env.MONGODB_URI || "";

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "",
  password: process.env.ADMIN_PASSWORD || "",
} as const;

export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.unosend.co",
  port: parseInt(process.env.SMTP_PORT || "587"),
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  from: process.env.SMTP_FROM || "",
} as const;

export const APP_CONFIG = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
const ADMIN_SESSION_SECONDS = 7 * 24 * 60 * 60;

export const COOKIE_CONFIG = {
  name: "admin-token",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  },
  maxAge: ADMIN_SESSION_SECONDS,
} as const;

export const TOKEN_CONFIG = {
  expirationTime: `${ADMIN_SESSION_SECONDS}s`,
} as const;

export const CACHE_TTL = {
  list: 300,
  detail: 600,
  feed: 3600,
} as const;

export const SOCIAL_LINKS = {
  github: process.env.NEXT_PUBLIC_GITHUB_LINK || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_LINK || "",
  twitter: process.env.NEXT_PUBLIC_TWITTER_LINK || "",
  email: process.env.NEXT_PUBLIC_PERSONAL_EMAIL || "",
} as const;

export function getAppUrl(): string {
  if (typeof window === "undefined") {
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }

  return window.location.origin;
}

const OPENROUTER_MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "poolside/laguna-m.1:free"
] as const;

const useCustomModel = process.env.USE_CUSTOM_AI_MODEL === "true";
const customModel = process.env.CUSTOM_AI_MODEL?.trim();
const defaultModelIndex = Number(process.env.DEFAULT_MODEL_INDEX) || 0;

const preferredModel =
  (useCustomModel && customModel) ||
  OPENROUTER_MODELS[defaultModelIndex] ||
  OPENROUTER_MODELS[0];

const fallbackModels: string[] = [
  preferredModel,
  ...OPENROUTER_MODELS.filter((m) => m !== preferredModel),
];

export const OPENROUTER_CONFIG = {
  apiKey: process.env.OPENROUTER_API_KEY || "",
  models: fallbackModels,
  model: preferredModel,
} as const;

export const OAUTH_CONFIG = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
} as const;

if (typeof window === "undefined" && !process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET environment variable is required in production");
}

export const NEXTAUTH_CONFIG = {
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  secret: process.env.NEXTAUTH_SECRET || "",
} as const;

export const REDIS_CONFIG = {
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  enabled:
    !!process.env.UPSTASH_REDIS_REST_URL &&
    !!process.env.UPSTASH_REDIS_REST_TOKEN,
} as const;
