import { Response } from 'express';
import { Tag } from '../models/Tag';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { Router } from 'express';

const router = Router();

/* ─── List all tags ─── */

router.get(
  '/',
  asyncHandler(async (_req, res: Response) => {
    const tags = await Tag.find().sort({ questionsCount: -1 });
    res.json(tags);
  }),
);

/* ─── Get tag by slug ─── */

router.get(
  '/:slug',
  asyncHandler(async (req, res: Response) => {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) throw ApiError.notFound('Tag not found');
    res.json(tag);
  }),
);

/* ─── Create tag ─── */

router.post(
  '/',
  asyncHandler(async (req, res: Response) => {
    const { name, description } = req.body;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

    const existing = await Tag.findOne({ slug });
    if (existing) throw ApiError.badRequest('Tag already exists');

    const tag = await Tag.create({ name, slug, description });
    res.status(201).json(tag);
  }),
);

export default router;
