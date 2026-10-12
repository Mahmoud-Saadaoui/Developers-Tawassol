import type { User } from '../types';

/** Bundled default avatar, served from `client/public/avatar.jpeg`. */
export const DEFAULT_AVATAR = '/avatar.jpeg';

/** Preferred avatar URL for a user, falling back to the bundled default. */
export function getAvatarUrl(user?: Pick<User, 'avatar'> | null): string {
  return user?.avatar?.url || DEFAULT_AVATAR;
}
