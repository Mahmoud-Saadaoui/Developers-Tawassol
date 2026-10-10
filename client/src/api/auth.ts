import { http } from '../api/http';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: { url: string };
    createdAt: string;
  };
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    http<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    http<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => http('/auth/logout', { method: 'POST' }),

  me: () => http<AuthResponse>('/auth/me'),
};
