import { z } from 'zod';

/** Max number of skill/experience/education entries in a profile. */
const MAX_ARRAY_ITEMS = 20;

/**
 * We keep optional links lenient (any trimmed string ≤ 300 chars, including
 * empty) and normalize empties to `undefined` on the controller side instead
 * of rejecting the whole payload with a strict `.url()`.
 */
const optionalLink = z.string().trim().max(300).optional();

const dateSchema = z.coerce.date();

/** One work experience entry. */
export const experienceSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    company: z.string().trim().min(1).max(120),
    location: z.string().trim().max(140).optional(),
    from: dateSchema,
    to: dateSchema.optional(),
    current: z.boolean().optional().default(false),
    description: z.string().trim().max(2000).optional(),
  })
  .refine((entry) => !entry.current || !entry.to, {
    message: 'Cannot set an end date on a current position',
    path: ['to'],
  })
  .refine((entry) => entry.current || entry.to, {
    message: 'Non-current entries need an end date',
    path: ['to'],
  });

/** One education entry. */
export const educationSchema = z
  .object({
    school: z.string().trim().min(1).max(140),
    degree: z.string().trim().min(1).max(140),
    fieldofstudy: z.string().trim().min(1).max(140),
    from: dateSchema,
    to: dateSchema.optional(),
    current: z.boolean().optional().default(false),
    description: z.string().trim().max(2000).optional(),
  })
  .refine((entry) => !entry.current || !entry.to, {
    message: 'Cannot set an end date when current is true',
    path: ['to'],
  })
  .refine((entry) => entry.current || entry.to, {
    message: 'Non-current entries need an end date',
    path: ['to'],
  });

export const socialSchema = z.object({
  youtube: optionalLink,
  twitter: optionalLink,
  facebook: optionalLink,
  linkedin: optionalLink,
  instagram: optionalLink,
});

/** The developer profile section of `User`. */
export const profileSchema = z.object({
  headline: z.string().trim().max(140).optional(),
  bio: z.string().trim().max(2000).optional(),
  location: z.string().trim().max(140).optional(),
  website: optionalLink,
  github: z.string().trim().max(120).optional(),
  skills: z.array(z.string().trim().max(40)).max(MAX_ARRAY_ITEMS).optional(),
  social: socialSchema.optional(),
  experience: z.array(experienceSchema).max(MAX_ARRAY_ITEMS).optional(),
  education: z.array(educationSchema).max(MAX_ARRAY_ITEMS).optional(),
});

/** `PUT /api/users/me/profile` body → `{ profile: {...} }`. */
export const updateProfileRequestSchema = z.object({
  profile: profileSchema,
});

/** `GET /api/users` query params. */
export const listUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().max(80).optional(),
});

/** Simple pagination for `GET /api/users/:id/questions`. */
export const listPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});