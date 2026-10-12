import { Avatar, type AvatarProps } from 'antd';
import type { User } from '../../types';
import { getAvatarUrl } from '../../utils/avatar';

type AvatarUser = Pick<User, 'name' | 'avatar'>;

interface UserAvatarProps extends Omit<AvatarProps, 'src' | 'children'> {
  user?: AvatarUser | null;
}

/**
 * Avatar with the project default fallback (`/avatar.jpeg`).
 * Falls back to the user's initial only if the image itself fails to load.
 */
export default function UserAvatar({ user, ...rest }: UserAvatarProps) {
  return (
    <Avatar src={getAvatarUrl(user)} {...rest}>
      {user?.name?.[0]?.toUpperCase()}
    </Avatar>
  );
}
