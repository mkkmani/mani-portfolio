import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  feedback?: 'like' | 'dislike' | null;
  createdAt: Date;
}

export interface ISessionMetadata {
  startedAt: Date;
  lastActivityAt: Date;
  messageCount: number;
}

export interface IPublishRequest {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: mongoose.Types.ObjectId;
}

export interface IPreparation extends Document {
  _id: mongoose.Types.ObjectId;
  topic: string;
  slug: string;
  published: boolean;
  discarded?: boolean; // Soft delete flag
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  userId?: mongoose.Types.ObjectId;
  categories?: string[];
  excerpt?: string;
  messages: IMessage[];
  preparationData?: {
    coreTopics?: IMessage[];
    commonQuestions?: IMessage[];
    practicalExamples?: IMessage[];
  };
  publishRequests?: IPublishRequest[];
  sessionMetadata?: ISessionMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({
  role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
  content: { type: String, required: true },
  feedback: { type: String, enum: ['like', 'dislike', null], default: null },
  createdAt: { type: Date, default: Date.now },
});

const PublishRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

const PreparationSchema: Schema = new Schema({
  topic: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  published: { type: Boolean, default: false },
  discarded: { type: Boolean, default: false }, // Added discarded field
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categories: [String],
  excerpt: String,
  messages: { type: [MessageSchema], default: [] },
  preparationData: {
    coreTopics: [MessageSchema],
    commonQuestions: [MessageSchema],
    practicalExamples: [MessageSchema],
  },
  publishRequests: [PublishRequestSchema],
  sessionMetadata: {
    startedAt: { type: Date },
    lastActivityAt: { type: Date },
    messageCount: { type: Number, default: 0 },
  },
}, { timestamps: true });

// Indexes: user sessions list, public published list (slug already unique-indexed).
PreparationSchema.index({ userId: 1, updatedAt: -1 });
PreparationSchema.index({ published: 1, discarded: 1, createdAt: -1 });


const Preparation: Model<IPreparation> = mongoose.models.Preparation || mongoose.model<IPreparation>('Preparation', PreparationSchema);

export default Preparation;
