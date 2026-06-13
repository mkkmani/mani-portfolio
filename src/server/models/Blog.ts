import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPublishRequest {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
}

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  discarded?: boolean; // Soft delete flag
  userId?: mongoose.Types.ObjectId;
  publishRequests?: IPublishRequest[];
  customDate?: Date;
  createdAt: string;
  updatedAt: string;
}

const PublishRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const BlogSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  tags: [String],
  published: { type: Boolean, default: false },
  favourite: { type: Boolean, default: false },
  discarded: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  publishRequests: [PublishRequestSchema],
  customDate: { type: Date },
}, { timestamps: true });

BlogSchema.index({ published: 1, discarded: 1, createdAt: -1 });
BlogSchema.index({ published: 1, updatedAt: -1 });
BlogSchema.index({ favourite: 1, published: 1 });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
