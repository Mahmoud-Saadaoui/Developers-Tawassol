import { z } from 'zod';

export const createQuestionSchema = z.object({
  title: z.string().min(10).max(200),
  content: z.string().min(20).max(10000),
  tags: z.array(z.string()).min(1).max(5),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const createAnswerSchema = z.object({
  content: z.string().min(10).max(10000),
});

export const updateAnswerSchema = createAnswerSchema.partial();

export const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

export const listQuestionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  sort: z.enum(['newest', 'votes', 'unanswered']).default('newest'),
  tag: z.string().optional(),
  /** Full-text search term (uses the Mongo `$text` index on title/content). */
  search: z.string().trim().max(120).optional(),
});
