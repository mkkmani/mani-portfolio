import { z } from "zod";

const EnvConfigSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB: z.string().min(1, "MONGODB_DB is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NEXT_PUBLIC_EMAIL: z.email().min(1, "EMAIL is required"),
  GMAIL_USER: z.string().min(1, "GMAIL_USER is required"),
  GMAIL_PASS: z.string().min(1, "GMAIL_PASS is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
});

const envConfig = EnvConfigSchema.safeParse(process.env);

if (!envConfig.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(envConfig.error)
  );
  throw new Error("Invalid environment variables");
}

export const ENV_CONFIG = envConfig.data;
