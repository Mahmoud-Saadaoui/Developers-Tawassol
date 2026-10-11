import type { ReactNode } from 'react';
import { Avatar, Space, Typography } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  GithubOutlined,
  GlobalOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import type { User } from '../../types';
import { useLocale } from '../../context/LocaleContext';

const { Title, Text } = Typography;

const socialIcons: Array<{ key: string; icon: ReactNode; label: string }> = [
  { key: 'youtube', icon: <YoutubeOutlined />, label: 'YouTube' },
  { key: 'twitter', icon: <TwitterOutlined />, label: 'Twitter / X' },
  { key: 'facebook', icon: <FacebookOutlined />, label: 'Facebook' },
  { key: 'linkedin', icon: <LinkedinOutlined />, label: 'LinkedIn' },
  { key: 'instagram', icon: <InstagramOutlined />, label: 'Instagram' },
];

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { locale } = useLocale();
  const profile = user.profile ?? {};
  const social = profile.social ?? {};
  const joined = new Date(user.createdAt).toLocaleDateString(
    locale === 'ar' ? 'ar' : 'en-GB',
    { year: 'numeric', month: 'short' },
  );

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <Avatar size={96} src={user.avatar?.url} style={{ flexShrink: 0 }}>
        {user.name?.[0]?.toUpperCase()}
      </Avatar>

      <div style={{ flex: 1, minWidth: 260 }}>
        <Title level={3} style={{ marginBottom: 4 }}>
          {user.name}
        </Title>
        {profile.headline && (
          <Text type="secondary" style={{ display: 'block', fontSize: 15 }}>
            {profile.headline}
          </Text>
        )}

        <Space wrap size={12} style={{ marginTop: 10 }}>
          {profile.location && (
            <Space size={4}>
              <EnvironmentOutlined />
              <Text type="secondary">{profile.location}</Text>
            </Space>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer">
              <GlobalOutlined /> Site web
            </a>
          )}
          {profile.github && (
            <a
              href={`https://github.com/${profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubOutlined /> GitHub
            </a>
          )}
          {socialIcons.map(({ key, icon, label }) => {
            const url = social[key as keyof typeof social];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
              >
                {icon}
              </a>
            );
          })}
          <Space size={4}>
            <CalendarOutlined />
            <Text type="secondary">
              {locale === 'ar' ? 'انضم في' : 'Joined'} {joined}
            </Text>
          </Space>
        </Space>
      </div>
    </div>
  );
}