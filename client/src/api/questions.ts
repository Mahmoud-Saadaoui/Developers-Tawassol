import { http } from './http';
import type { Post, PaginatedResponse } from '../types';

export interface ListQuestionsParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'votes' | 'unanswered';
  tag?: string;
  /** Full-text search term (matches question title/content). */
  search?: string;
}

export const questionsApi = {
  list: (params: ListQuestionsParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.sort) query.set('sort', params.sort);
    if (params.tag) query.set('tag', params.tag);
    if (params.search) query.set('search', params.search);
    return http<PaginatedResponse<Post>>(`/questions?${query}`);
  },

  get: (id: string) => http<Post>(`/questions/${id}`),

  create: (data: { title: string; content: string; tags: string[] }) =>
    http<Post>('/questions', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: { title?: string; content?: string; tags?: string[] }) =>
    http<Post>(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => http(`/questions/${id}`, { method: 'DELETE' }),

  getAnswers: (id: string) => http<Post[]>(`/questions/${id}/answers`),

  addAnswer: (id: string, content: string) =>
    http<Post>(`/questions/${id}/answers`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  updateAnswer: (answerId: string, content: string) =>
    http<Post>(`/questions/answers/${answerId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  deleteAnswer: (answerId: string) =>
    http(`/questions/answers/${answerId}`, { method: 'DELETE' }),
};
