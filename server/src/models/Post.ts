import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  type: 'question' | 'answer';
  title?: string;
  content: string;
  author: mongoose.Types.ObjectId;
  parent?: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  votes: Array<{ user: mongoose.Types.ObjectId; value: number }>;
  votesTotal: number;
  answersCount: number;
  views: number;
  acceptedAnswer?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    type: { type: String, enum: ['question', 'answer'], required: true },
    title: { type: String, maxlength: 200 },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, enum: [-1, 1] },
      },
    ],
    votesTotal: { type: Number, default: 0 },
    answersCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

postSchema.index({ parent: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: 'text', content: 'text' });

export const Post = mongoose.model<IPost>('Post', postSchema);
