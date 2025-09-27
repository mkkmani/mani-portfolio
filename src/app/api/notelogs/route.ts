import { NextRequest, NextResponse } from "next/server";
import { createNotelogController } from "@/server/controllers/noteLogController";
import { getNotelogsController } from "@/server/controllers/noteLogController";
import { updateNotelogStatusController } from "@/server/controllers/noteLogController";

export async function POST(req: NextRequest) {
  return createNotelogController(req);
}

export async function GET() {
  return getNotelogsController();
}

export async function PUT(req: NextRequest) {
  return updateNotelogStatusController(req);
}

export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
