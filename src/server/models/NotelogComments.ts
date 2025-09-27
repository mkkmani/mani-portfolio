import mongoose, { Document, Types } from "mongoose";

export interface CommentProps extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  notelog: Types.ObjectId;
  parent?: Types.ObjectId | null;
}

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notelog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notelog",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
