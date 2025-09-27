import { Notelog, NotelogProps } from "@/server/models/Notelog";
import Comment, { CommentProps } from "@/server/models/NotelogComments";

export const createNotelog = async (notelogData: NotelogProps) => {
  try {
    const newNotelog = new Notelog(notelogData);
    await newNotelog.save();
    return newNotelog;
  } catch (error) {
    throw new Error("Error creating Notelog: " + error);
  }
};

export const getNotelogs = async () => {
  try {
    const notelogs = await Notelog.find({
      status: "approved",
      published: true,
    }).sort({ createdAt: -1 });
    return notelogs;
  } catch (error) {
    throw new Error("Error fetching Notelogs: " + error);
  }
};

export const getNotelogBySlug = async (slug: string) => {
  try {
    const notelog = await Notelog.findOne({
      slug,
      status: "approved",
      published: true,
    });

    if (!notelog) {
      throw new Error("Note log not found or not published");
    }
    return notelog;
  } catch (error) {
    throw new Error("Error fetching Note log: " + error);
  }
};

export const updateNotelogStatus = async (
  slug: string,
  updateData: NotelogProps
) => {
  try {
    const notelog = await Notelog.findOne({ slug });
    if (!notelog) {
      throw new Error("Notelog not found");
    }

    Object.assign(notelog, updateData);

    await notelog.save();
    return notelog;
  } catch (error) {
    throw new Error("Error updating Notelog: " + error);
  }
};

export const addCommentToNotelog = async (commentData: CommentProps) => {
  try {
    const newComment = new Comment(commentData);
    await newComment.save();

    await Notelog.findOneAndUpdate(
      { slug: commentData.notelog },
      {
        $push: { comments: newComment._id },
      }
    );

    return newComment;
  } catch (error) {
    throw new Error("Error adding comment: " + error);
  }
};
