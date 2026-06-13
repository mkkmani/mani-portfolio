import { createHash, randomInt, timingSafeEqual } from "crypto";

export function generateOtp(length = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) otp += randomInt(0, 10).toString();
  return otp;
}

export function hashOtp(otp: string): string {
  return createHash("sha256").update(String(otp)).digest("hex");
}

export function verifyOtp(submitted: string, storedHash: string): boolean {
  const a = Buffer.from(hashOtp(submitted));
  const b = Buffer.from(storedHash);
  return a.length === b.length && timingSafeEqual(a, b);
}
