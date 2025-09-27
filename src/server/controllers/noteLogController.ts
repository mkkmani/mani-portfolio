import {
  notelogCreateSchema,
  notelogUpdateSchema,
} from "../utils/noteLogValidation";
import {
  createNotelog,
  getNotelogs,
  getNotelogBySlug,
  updateNotelogStatus,
} from "../services/noteLogServices";
import { NextRequest, NextResponse } from "next/server";
import { NotelogProps } from "@/server/models/Notelog";
import connectToDB from "@/server/db/mongoDb";
import { verifyToken } from "../services/authServices";

export const createNotelogController = async (req: NextRequest) => {
  try {
    await connectToDB();

    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "No authentication token provided" },
        { status: 401 }
      );
    }
    const decodedToken = verifyToken(token);
    const { id, role } = decodedToken;
    const requestData = await req.json();
    const validatedData = notelogCreateSchema.parse({
      ...requestData,
      author: id,
      approved: role === "admin",
      status: role === "admin" ? "approved" : "pending",
    });

    const newNotelog = await createNotelog(
      validatedData as unknown as NotelogProps
    );

    return NextResponse.json(
      { message: "Notelog created successfully", data: newNotelog },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
};

export const getNotelogsController = async () => {
  try {
    await connectToDB();
    const notelogs = await getNotelogs();
    return NextResponse.json(notelogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
};

export const getNotelogByIdController = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    await connectToDB();
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { message: "No id is provided" },
        { status: 400 }
      );
    }

    const notelog = await getNotelogBySlug(slug);
    if (!notelog) {
      return NextResponse.json(
        { message: "Note log not found or not published" },
        { status: 404 }
      );
    }
    return NextResponse.json(notelog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 404 });
  }
};

export const updateNotelogStatusController = async (req: NextRequest) => {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const validatedData = notelogUpdateSchema.parse(await req.json());

    const updatedNotelog = await updateNotelogStatus(
      id,
      validatedData as NotelogProps
    );
    return NextResponse.json(updatedNotelog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }
};

// export const addCommentController = async (
//   req: NextRequest,
//   res: NextResponse
// ) => {
//   try {
//     const validatedData = commentCreateSchema.parse(await req.json());

//     const newComment = await addCommentToNotelog(validatedData as CommentProps);
//     return NextResponse.json(
//       { message: "Comment added successfully", newComment },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json({ message: error }, { status: 400 });
//   }
// };
