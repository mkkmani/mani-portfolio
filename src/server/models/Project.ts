import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  image: string;
  link?: string;
  github?: string;
  tags: string[];
  published: boolean;
  favourite: boolean;
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  github: { type: String },
  tags: { type: [String], default: [] },
  published: { type: Boolean, default: false },
  favourite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
