import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document {
  email: string;
  password?: string;
  createdAt: Date;
  role: "admin" | "user";
  provider?: string;
  providerId?: string;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function (this: UserDocument) {
      return !this.provider;
    },
  },
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  provider: {
    type: String,
    enum: ["google", "github"],
    required: false,
  },
  providerId: { type: String, required: false },
});

const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

export default User;
