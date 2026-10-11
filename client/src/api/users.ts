import { http } from './http';
import type { PaginatedResponse, Post, User, UserProfile, UserStats } from '../types';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserDetailResponse {
  user: User;
  stats: UserStats;
}

export const usersApi = {
  list: (params: ListUsersParams = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    return http<PaginatedResponse<User>>(`/users?${query}`);
  },

  get: (id: string) => http<UserDetailResponse>(`/users/${id}`),

  getQuestions: (id: string, params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return http<PaginatedResponse<Post>>(`/users/${id}/questions?${query}`);
  },

  updateProfile: (profile: Partial<UserProfile>) =>
    http<{ user: User }>('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify({ profile }),
    }),
};