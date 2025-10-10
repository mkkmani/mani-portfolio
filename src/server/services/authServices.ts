import { ENV_CONFIG } from "@/config/envConfig";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
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

type JwtPayload = {
  id: string;
  role?: string;
  [key: string]: unknown;
};

type GenerateTokenArgs = {
  payload: JwtPayload;
  expiresIn?: SignOptions["expiresIn"];
  algorithm?: Extract<SignOptions["algorithm"], "HS256" | "HS384" | "HS512">;
};

export function generateToken({
  payload,
  expiresIn,
  algorithm = "HS512",
}: GenerateTokenArgs): string {
  const secret = ENV_CONFIG.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT secret is missing. Set ENV_CONFIG.JWT_SECRET.");
  }

  const options: SignOptions = {
    algorithm, // HS256 | HS384 | HS512
    expiresIn: expiresIn ?? "1h",
  };

  return jwt.sign(payload, secret, options);
}

export const JwtPayloadSchema = z.object({
  id: z.string(),
  role: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export const verifyToken = (token: string): JwtPayload => {
  if (!token) {
    throw new Error("No token provided");
  }

  const secret = ENV_CONFIG.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT secret is missing. Set ENV_CONFIG.JWT_SECRET.");
  }

  try {
    const decoded = jwt.verify(token, secret);

    const validationResult = JwtPayloadSchema.safeParse(decoded);

    if (!validationResult.success) {
      console.error("Token validation failed:", validationResult.error);
      throw new Error("Invalid token structure");
    }

    return validationResult.data;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Error verifying token");
  }
};
