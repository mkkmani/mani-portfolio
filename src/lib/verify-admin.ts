import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JWT_SECRET, COOKIE_CONFIG } from "./config";

export async function verifyAdminToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  return verifyAdminToken(req.cookies.get(COOKIE_CONFIG.name)?.value);
}
export async function verifyAdminCookies(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(COOKIE_CONFIG.name)?.value);
}
