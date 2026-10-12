import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../context/LocaleContext';
import VoteButtons from './VoteButtons';

// Hoisted so the `vi.mock` factories below can reference them safely.
const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  user: { id: 'user-1' } as { id: string } | null,
}));

vi.mock('../../hooks/useQuestions', () => ({
  useVote: () => ({ mutate: mocks.mutate, isPending: false }),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: mocks.user }),
}));

function renderVoteButtons(votesTotal = 0) {
  render(
    <MemoryRouter initialEntries={['/']}>
      <LocaleProvider>
        <Routes>
          <Route
            path="/"
            element={<VoteButtons postId="post-1" votesTotal={votesTotal} votes={[]} />}
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </LocaleProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mocks.mutate.mockReset();
  mocks.user = { id: 'user-1' };
});

describe('VoteButtons', () => {
  it('renders the current score', () => {
    renderVoteButtons(42);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('votes up and down through the mutation', async () => {
    const user = userEvent.setup();
    renderVoteButtons();

    await user.click(screen.getByRole('button', { name: 'Upvote' }));
    expect(mocks.mutate).toHaveBeenCalledWith({ postId: 'post-1', value: 1 });

    await user.click(screen.getByRole('button', { name: 'Downvote' }));
    expect(mocks.mutate).toHaveBeenCalledWith({ postId: 'post-1', value: -1 });
  });

  it('redirects an anonymous visitor to the login page instead of voting', async () => {
    mocks.user = null;
    const user = userEvent.setup();
    renderVoteButtons();

    await user.click(screen.getByRole('button', { name: 'Upvote' }));

    expect(mocks.mutate).not.toHaveBeenCalled();
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });
});
