import { http } from './http';
import type { Tag } from '../types';

export const tagsApi = {
  list: () => http<Tag[]>('/tags'),

  get: (slug: string) => http<Tag>(`/tags/${slug}`),

  create: (data: { name: string; description?: string }) =>
    http<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) }),
};
