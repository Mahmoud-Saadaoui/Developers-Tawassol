import { http } from './http';

export const votesApi = {
  vote: (postId: string, value: 1 | -1) =>
    http<{ votesTotal: number }>(`/votes/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    }),

  remove: (postId: string) =>
    http<{ votesTotal: number }>(`/votes/${postId}`, { method: 'DELETE' }),

  accept: (questionId: string, answerId: string) =>
    http(`/votes/${questionId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ answerId }),
    }),
};
