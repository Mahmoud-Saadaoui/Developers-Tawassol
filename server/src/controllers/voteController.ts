import mongoose from 'mongoose';
import { Response } from 'express';
import { Post } from '../models/Post';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import { voteSchema } from '../validators/post';
import { Router } from 'express';

const router = Router();

/* ─── Vote on a post ─── */

router.post(
  '/:postId',
  requireAuth,
  validate(voteSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { value } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) throw ApiError.notFound('Post not found');

    const existingVote = post.votes.find(
      (v) => v.user.toString() === req.userId,
    );

    if (existingVote) {
      if (existingVote.value === value) {
        // Toggle off — remove vote
        post.votes = post.votes.filter(
          (v) => v.user.toString() !== req.userId,
        );
        post.votesTotal -= value;
      } else {
        // Change vote
        post.votesTotal += 2 * value;
        existingVote.value = value;
      }
    } else {
      post.votes.push({ user: new mongoose.Types.ObjectId(req.userId), value });
      post.votesTotal += value;
    }

    await post.save();

    res.json({ votesTotal: post.votesTotal, votes: post.votes });
  }),
);

/* ─── Remove vote ─── */

router.delete(
  '/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const post = await Post.findById(req.params.postId);
    if (!post) throw ApiError.notFound('Post not found');

    const vote = post.votes.find(
      (v) => v.user.toString() === req.userId,
    );

    if (!vote) throw ApiError.badRequest('No vote to remove');

    post.votes = post.votes.filter(
      (v) => v.user.toString() !== req.userId,
    );
    post.votesTotal -= vote.value;

    await post.save();

    res.json({ votesTotal: post.votesTotal });
  }),
);

/* ─── Accept an answer ─── */

router.post(
  '/:questionId/accept',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { answerId } = req.body;
    if (!answerId) throw ApiError.badRequest('answerId is required');

    const question = await Post.findOne({
      _id: req.params.questionId,
      type: 'question',
      author: req.userId,
    });

    if (!question) throw ApiError.notFound('Question not found or not authorized');

    const answer = await Post.findOne({
      _id: answerId,
      type: 'answer',
      parent: question._id,
    });

    if (!answer) throw ApiError.notFound('Answer not found');

    // Accepting an answer simply overwrites the question's `acceptedAnswer`;
    // there is no separate flag to unset on the previously accepted answer.
    question.acceptedAnswer = answer._id;
    await question.save();

    res.json({ message: 'Answer accepted' });
  }),
);

export default router;
