import { ENV_CONFIG } from "@/config/envConfig";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = ({
  id,
  expiresIn,
}: {
  id: string;
  expiresIn?: number;
}): string => {
  return jwt.sign({ id }, ENV_CONFIG.JWT_SECRET, {
    expiresIn: expiresIn || "1h",
  });
};

export const JwtPayloadSchema = z.object({
  userId: z.string(),
  role: z.string(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET) as JwtPayload;

    JwtPayloadSchema.parse(decoded);

    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
