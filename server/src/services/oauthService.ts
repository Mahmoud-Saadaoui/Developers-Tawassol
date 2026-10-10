import { IUser, User } from '../models/User';

export interface OAuthProfile {
  provider: 'google' | 'github' | 'linkedin';
  providerId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

/**
 * Find or create a user from an OAuth profile.
 * If the email already exists, link the provider to the existing account.
 */
export async function findOrCreateOAuthUser(
  profile: OAuthProfile,
): Promise<IUser> {
  // Try to find by provider first
  let user = await User.findOne({
    provider: profile.provider,
    providerId: profile.providerId,
  });

  if (user) return user;

  // Check if email already exists → link provider
  user = await User.findOne({ email: profile.email.toLowerCase() });
  if (user) {
    user.provider = profile.provider;
    user.providerId = profile.providerId;
    if (!user.avatar?.url && profile.avatarUrl) {
      user.avatar = { url: profile.avatarUrl, publicId: '' };
    }
    await user.save();
    return user;
  }

  // Create new user
  user = await User.create({
    name: profile.name,
    email: profile.email.toLowerCase(),
    provider: profile.provider,
    providerId: profile.providerId,
    avatar: profile.avatarUrl
      ? { url: profile.avatarUrl, publicId: '' }
      : undefined,
  });

  return user;
}
