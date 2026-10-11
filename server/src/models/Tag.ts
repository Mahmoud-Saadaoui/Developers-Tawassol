import mongoose from 'mongoose';

export interface ITag extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new mongoose.Schema<ITag>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, index: true, maxlength: 80 },
    description: { type: String, maxlength: 300 },
    questionsCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
