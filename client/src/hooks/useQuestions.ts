import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '../api/questions';
import { votesApi } from '../api/votes';
import { tagsApi } from '../api/tags';
import { useAuth } from '../context/AuthContext';
import type { Post, PaginatedResponse } from '../types';

/* ─── Questions ─── */

export function useQuestions(params: Parameters<typeof questionsApi.list>[0] = {}) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsApi.list(params),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string; tags: string[] }) =>
      questionsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
}

export function useUpdateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { title?: string; content?: string; tags?: string[] };
    }) => questionsApi.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['question', vars.id] });
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['questions'] }),
  });
}

/* ─── Answers ─── */

export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: () => questionsApi.getAnswers(questionId),
    enabled: !!questionId,
  });
}

export function useCreateAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      questionsApi.addAnswer(questionId, content),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['answers', vars.questionId] });
      qc.invalidateQueries({ queryKey: ['question', vars.questionId] });
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      questionsApi.updateAnswer(id, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['answers'] }),
  });
}

export function useDeleteAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.deleteAnswer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['answers'] });
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

/* ─── Votes ─── */

/** Apply an optimistic vote to a single post (toggle / switch / add). */
function applyVote(post: Post, userId: string | undefined, value: 1 | -1): Post {
  if (!userId) return post;

  const existing = post.votes.find((v) => v.user === userId);
  const votes = post.votes.filter((v) => v.user !== userId);

  // Same value again → toggle the vote off.
  if (existing && existing.value === value) {
    return { ...post, votes, votesTotal: post.votesTotal - value };
  }

  // New vote, or switch from the opposite value (+2·value to flip -1 ⇄ 1).
  const delta = existing ? 2 * value : value;
  return {
    ...post,
    votes: [...votes, { user: userId, value }],
    votesTotal: post.votesTotal + delta,
  };
}

export function useVote() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ postId, value }: { postId: string; value: 1 | -1 }) =>
      votesApi.vote(postId, value),

    onMutate: async ({ postId, value }) => {
      // Stop in-flight refetches so they don't clobber the optimistic state.
      await qc.cancelQueries({ queryKey: ['questions'] });
      await qc.cancelQueries({ queryKey: ['question', postId] });
      await qc.cancelQueries({ queryKey: ['answers'] });

      const prevLists = qc.getQueriesData<PaginatedResponse<Post>>({
        queryKey: ['questions'],
      });
      const prevQuestion = qc.getQueryData<Post>(['question', postId]);
      const prevAnswers = qc.getQueriesData<Post[]>({ queryKey: ['answers'] });

      prevLists.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(key, {
          ...data,
          items: data.items.map((p) =>
            p.id === postId ? applyVote(p, user?.id, value) : p,
          ),
        });
      });

      if (prevQuestion?.id === postId) {
        qc.setQueryData(['question', postId], applyVote(prevQuestion, user?.id, value));
      }

      prevAnswers.forEach(([key, data]) => {
        if (!data) return;
        qc.setQueryData(
          key,
          data.map((p) => (p.id === postId ? applyVote(p, user?.id, value) : p)),
        );
      });

      return { prevLists, prevQuestion, prevAnswers };
    },

    onError: (_err, _vars, ctx) => {
      // Roll back every snapshot on failure.
      ctx?.prevLists.forEach(([key, data]) => qc.setQueryData(key, data));
      if (ctx?.prevQuestion) {
        qc.setQueryData(['question', ctx.prevQuestion.id], ctx.prevQuestion);
      }
      ctx?.prevAnswers.forEach(([key, data]) => qc.setQueryData(key, data));
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['questions'] });
      qc.invalidateQueries({ queryKey: ['question'] });
      qc.invalidateQueries({ queryKey: ['answers'] });
    },
  });
}

export function useAcceptAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: string; answerId: string }) =>
      votesApi.accept(questionId, answerId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['question', vars.questionId] });
      qc.invalidateQueries({ queryKey: ['answers', vars.questionId] });
      qc.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

/* ─── Tags ─── */

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.list(),
  });
}
