import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  status: 'active' | 'disabled' | 'blocked';
  statusReason?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLoginAt?: Date;
  loginCount: number;
  preferences?: Record<string, unknown>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  emailVerified: { type: Date },
  status: {
    type: String,
    enum: ['active', 'disabled', 'blocked'],
    default: 'active'
  },
  statusReason: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  preferences: { type: Schema.Types.Mixed, default: {} },
});

// Add indexes for efficient queries (email already indexed via unique: true)
UserSchema.index({ status: 1 });


export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
