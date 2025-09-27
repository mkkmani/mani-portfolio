import mongoose, { Schema } from "mongoose";

interface NotelogProps {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  published: boolean;
  coverImage?: string | null;
  views: number;
  comments: mongoose.Types.ObjectId[];
  isDiscarded: boolean;
}

const notelogSchema = new Schema<NotelogProps>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    published: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: null,
    },
    isDiscarded: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Notelog =
  mongoose.models.Notelog ||
  mongoose.model<NotelogProps>("Notelog", notelogSchema);

export { Notelog };
export type { NotelogProps };
