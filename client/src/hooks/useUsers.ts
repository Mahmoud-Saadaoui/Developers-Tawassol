import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { UserProfile } from '../types';

/* ─── Directory ─── */

export function useUsers(params: Parameters<typeof usersApi.list>[0] = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.list(params),
  });
}

/* ─── Single public profile ─── */

export function useUser(id?: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.get(id as string),
    enabled: !!id,
  });
}

export function useUserQuestions(id?: string, page = 1) {
  return useQuery({
    queryKey: ['user-questions', id, page],
    queryFn: () => usersApi.getQuestions(id as string, { page }),
    enabled: !!id,
  });
}

/* ─── Update own profile ─── */

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => usersApi.updateProfile(profile),
    onSuccess: () => {
      // The public profile might be visible somewhere; refresh user lists.
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.invalidateQueries({ queryKey: ['user'] });
    },
  });
}