import { Response } from 'express';
import { Router } from 'express';
import { Post } from '../models/Post';
import { User, toSafeJSON } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth, type AuthRequest } from '../middleware/requireAuth';
import { validate } from '../middleware/validate';
import {
  updateProfileRequestSchema,
  listUsersSchema,
  listPaginationSchema,
} from '../validators/profile';

const router = Router();

/** Escape a user-provided string so it is safe inside a RegExp. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Trim a value and drop empty strings (optional fields stay clean). */
function cleanValue(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
}

/**
 * Recursively cleans a profile payload: trims strings, removes empty ones
 * from simple objects (e.g. `social`), keeps arrays as-is.
 */
function cleanProfile(profile: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(profile)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      cleaned[key] = value;
    } else if (typeof value === 'object' && value !== null) {
      const inner: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        const c = cleanValue(v);
        if (c !== undefined) inner[k] = c;
      }
      cleaned[key] = Object.keys(inner).length ? inner : undefined;
    } else {
      const c = cleanValue(value);
      if (c !== undefined) cleaned[key] = c;
    }
  }
  return cleaned;
}

/* ─── Developer directory (annuaire) ─── */

router.get(
  '/',
  validate(listUsersSchema, 'query'),
  asyncHandler(async (req, res: Response) => {
    const { page, limit, search } = req.query as unknown as {
      page: number;
      limit: number;
      search?: string;
    };

    const query: Record<string, unknown> = {};
    if (search) {
      const re = new RegExp(escapeRegex(search), 'i');
      query.$or = [
        { name: re },
        { 'profile.headline': re },
        { 'profile.location': re },
        { 'profile.github': re },
        { 'profile.skills': re },
      ];
    }

    const [items, total] = await Promise.all([
      User.find(query)
        .select('name avatar profile.headline profile.location profile.skills')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  }),
);

/* ─── Update own profile ─── */

router.put(
  '/me/profile',
  requireAuth,
  validate(updateProfileRequestSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.userId);
    if (!user) throw ApiError.notFound('User not found');

    const { profile } = req.body as { profile: Record<string, unknown> };

    // Merge onto the existing profile so fields sent as `undefined` are kept.
    user.profile = { ...user.profile, ...cleanProfile(profile) } as typeof user.profile;
    await user.save();

    res.json({ user: toSafeJSON(user) });
  }),
);

/* ─── Public profile + stats ─── */

router.get(
  '/:id',
  asyncHandler(async (req, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');

    const [questions, answers, votesAgg, acceptedAgg] = await Promise.all([
      Post.countDocuments({ type: 'question', author: user._id }),
      Post.countDocuments({ type: 'answer', author: user._id }),
      Post.aggregate([
        { $match: { author: user._id } },
        {
          $group: {
            _id: null,
            votesTotal: { $sum: '$votesTotal' },
            views: { $sum: '$views' },
          },
        },
      ]),
      Post.aggregate([
        { $match: { type: 'answer', author: user._id } },
        { $lookup: { from: 'posts', localField: 'parent', foreignField: '_id', as: 'parent' } },
        { $unwind: '$parent' },
        { $match: { $expr: { $eq: ['$parent.acceptedAnswer', '$_id'] } } },
        { $count: 'total' },
      ]),
    ]);

    const stats = {
      questions,
      answers,
      votesTotal: votesAgg[0]?.votesTotal ?? 0,
      views: votesAgg[0]?.views ?? 0,
      acceptedAnswers: acceptedAgg[0]?.total ?? 0,
    };

    res.json({
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        profile: user.profile,
        createdAt: user.createdAt,
      },
      stats,
    });
  }),
);

/* ─── Questions asked by a user ─── */

router.get(
  '/:id/questions',
  validate(listPaginationSchema, 'query'),
  asyncHandler(async (req, res: Response) => {
    const { page, limit } = req.query as unknown as { page: number; limit: number };

    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');

    const query = { type: 'question', author: user._id, parent: null };
    const [items, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('author', 'name email avatar')
        .populate('tags', 'name slug'),
      Post.countDocuments(query),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  }),
);

export default router;