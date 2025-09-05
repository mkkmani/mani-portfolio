import { z } from "zod";

const EnvConfigSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB: z.string().min(1, "MONGODB_DB is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NODE_ENV: z.string().min(1, "NODE_ENV is required"),
});

const envConfig = EnvConfigSchema.safeParse(process.env);

if (!envConfig.success) {
  console.error(
    "Invalid environment variables:",
    z.treeifyError(envConfig.error)
  );
  process.exit(1);
}

export const ENV_CONFIG = envConfig.data;
