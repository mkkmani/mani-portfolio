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

export interface IPreparation extends Document {
  topic: string;
  slug: string;
  title: string;
  excerpt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  messages: IMessage[];
  published: boolean;
  userId?: mongoose.Types.ObjectId;
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

const PreparationSchema: Schema = new Schema({
  topic: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  messages: [MessageSchema],
  published: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionMetadata: {
    startedAt: { type: Date },
    lastActivityAt: { type: Date },
    messageCount: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add index for efficient user-specific queries (slug already indexed via unique: true)
PreparationSchema.index({ userId: 1 });


const Preparation: Model<IPreparation> = mongoose.models.Preparation || mongoose.model<IPreparation>('Preparation', PreparationSchema);

export default Preparation;
