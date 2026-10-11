import { Avatar, Card, Space, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import type { User } from '../../types';

const { Text } = Typography;

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const profile = user.profile ?? {};

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space align="start" style={{ width: '100%' }}>
        <Avatar size={48} src={user.avatar?.url}>
          {user.name?.[0]?.toUpperCase()}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/users/${user.id}`}>
            <Text strong style={{ fontSize: 15 }}>
              {user.name}
            </Text>
          </Link>
          {profile.headline && (
            <Text type="secondary" style={{ display: 'block' }}>
              {profile.headline}
            </Text>
          )}
          {profile.location && (
            <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>
              {profile.location}
            </Text>
          )}
          {profile.skills && profile.skills.length > 0 && (
            <Space wrap size={4} style={{ marginTop: 6 }}>
              {profile.skills.slice(0, 5).map((skill) => (
                <Tag key={skill} style={{ marginInlineEnd: 0 }}>
                  {skill}
                </Tag>
              ))}
            </Space>
          )}
        </div>
      </Space>
    </Card>
  );
}