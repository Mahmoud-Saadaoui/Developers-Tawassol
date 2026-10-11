import { Response } from 'express';
import { Post, IPost } from '../models/Post';
import { Tag } from '../models/Tag';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import {
  createQuestionSchema,
  updateQuestionSchema,
  listQuestionsSchema,
  createAnswerSchema,
  updateAnswerSchema,
} from '../validators/post';
import { Router } from 'express';

const router = Router();

/* ─── List questions ─── */

router.get(
  '/',
  validate(listQuestionsSchema, 'query'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page, limit, sort, tag } = req.query as unknown as {
      page: number;
      limit: number;
      sort: string;
      tag?: string;
    };

    const query: Record<string, unknown> = { type: 'question', parent: null };
    if (tag) query.tags = tag;
    if (sort === 'unanswered') query.answersCount = 0;

    const sortOption: Record<string, 1 | -1> =
      sort === 'votes' ? { votesTotal: -1, createdAt: -1 } : { createdAt: -1 };

    const [items, total] = await Promise.all([
      Post.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'name email avatar')
        .populate('tags', 'name slug'),
      Post.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  }),
);

/* ─── Get single question ─── */

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({
      _id: req.params.id,
      type: 'question',
    })
      .populate('author', 'name email avatar profile')
      .populate('tags', 'name slug');

    if (!post) throw ApiError.notFound('Question not found');

    // Increment views
    await Post.updateOne({ _id: post._id }, { $inc: { views: 1 } });

    res.json(post);
  }),
);

/* ─── Create question ─── */

router.post(
  '/',
  requireAuth,
  validate(createQuestionSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, tags: tagIds } = req.body;

    // Verify all tags exist
    const tags = await Tag.find({ _id: { $in: tagIds } });
    if (tags.length !== tagIds.length) {
      throw ApiError.badRequest('One or more tags do not exist');
    }

    const post = await Post.create({
      type: 'question',
      title,
      content,
      author: req.userId,
      tags: tagIds,
    });

    // Update tag counts
    await Tag.updateMany({ _id: { $in: tagIds } }, { $inc: { questionsCount: 1 } });

    const populated = await post.populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'tags', select: 'name slug' },
    ]);

    res.status(201).json(populated);
  }),
);

/* ─── Update question ─── */

router.put(
  '/:id',
  requireAuth,
  validate(updateQuestionSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      _id: req.params.id,
      type: 'question',
      author: req.userId,
    });

    if (!post) throw ApiError.notFound('Question not found or not authorized');

    Object.assign(post, req.body);
    await post.save();

    const populated = await post.populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'tags', select: 'name slug' },
    ]);

    res.json(populated);
  }),
);

/* ─── Delete question ─── */

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findOne({
      _id: req.params.id,
      type: 'question',
      author: req.userId,
    });

    if (!post) throw ApiError.notFound('Question not found or not authorized');

    // Delete all answers for this question
    await Post.deleteMany({ parent: post._id });

    // Decrement tag counts
    await Tag.updateMany(
      { _id: { $in: post.tags } },
      { $inc: { questionsCount: -1 } },
    );

    await post.deleteOne();

    res.json({ message: 'Question deleted' });
  }),
);

/* ─── Answers ─── */

router.get(
  '/:id/answers',
  asyncHandler(async (req, res) => {
    const answers = await Post.find({
      parent: req.params.id,
      type: 'answer',
    })
      .sort({ votesTotal: -1, createdAt: 1 })
      .populate('author', 'name email avatar');

    res.json(answers);
  }),
);

router.post(
  '/:id/answers',
  requireAuth,
  validate(createAnswerSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const question = await Post.findOne({
      _id: req.params.id,
      type: 'question',
    });

    if (!question) throw ApiError.notFound('Question not found');

    const answer = await Post.create({
      type: 'answer',
      content: req.body.content,
      author: req.userId,
      parent: question._id,
    });

    // Increment answers count
    await Post.updateOne({ _id: question._id }, { $inc: { answersCount: 1 } });

    const populated = await answer.populate('author', 'name email avatar');

    res.status(201).json(populated);
  }),
);

/* ─── Update/Delete answer ─── */

router.put(
  '/answers/:id',
  requireAuth,
  validate(updateAnswerSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const answer = await Post.findOne({
      _id: req.params.id,
      type: 'answer',
      author: req.userId,
    });

    if (!answer) throw ApiError.notFound('Answer not found or not authorized');

    Object.assign(answer, req.body);
    await answer.save();

    res.json(answer);
  }),
);

router.delete(
  '/answers/:id',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const answer = await Post.findOne({
      _id: req.params.id,
      type: 'answer',
      author: req.userId,
    });

    if (!answer) throw ApiError.notFound('Answer not found or not authorized');

    // Decrement parent's answers count
    await Post.updateOne(
      { _id: answer.parent },
      { $inc: { answersCount: -1 } },
    );

    await answer.deleteOne();

    res.json({ message: 'Answer deleted' });
  }),
);

export default router;
