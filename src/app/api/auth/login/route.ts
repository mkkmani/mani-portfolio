import { loginUser } from "@/server/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return await loginUser(req);
}
