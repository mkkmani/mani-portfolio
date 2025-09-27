import { NextRequest, NextResponse } from "next/server";
import { getNotelogBySlug } from "@/server/services/noteLogServices";
import connectToDB from "@/server/db/mongoDb";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "No id is provided" }, { status: 400 });
    }

    await connectToDB();
    const notelog = await getNotelogBySlug(slug);
    if (!notelog) {
      return NextResponse.json(
        { error: "Note log not found or not published" },
        { status: 404 }
      );
    }
    return NextResponse.json(notelog);
  } catch (error) {
    console.error("Error fetching note log:", error);
    let errorMessage = "Failed to fetch note log";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
      statusCode = error.message === "Notelog not found" ? 404 : statusCode;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
