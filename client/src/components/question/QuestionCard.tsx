import { Card, Space, Typography, Avatar } from 'antd';
import { MessageOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import type { Post } from '../../types';
import { useLocale } from '../../context/LocaleContext';
import TagChip from './TagChip';
import VoteButtons from './VoteButtons';

const { Text, Paragraph } = Typography;

interface QuestionCardProps {
  question: Post;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const { t } = useLocale();

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Space align="start" style={{ width: '100%' }}>
        <VoteButtons postId={question.id} votesTotal={question.votesTotal} votes={question.votes} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/questions/${question.id}`}>
            <Text strong style={{ fontSize: 16 }}>
              {question.title}
            </Text>
          </Link>

          <Paragraph
            type="secondary"
            ellipsis={{ rows: 2 }}
            style={{ margin: '4px 0 8px' }}
          >
            {question.content.replace(/[#*`]/g, '').slice(0, 200)}
          </Paragraph>

          <Space size={16} wrap>
            <Space size={4}>
              <Avatar size={20} src={question.author.avatar?.url} />
              <Text type="secondary">{question.author.name}</Text>
            </Space>
            <Space size={4}>
              <MessageOutlined />
              <Text type="secondary">{t('common.answers', { count: question.answersCount })}</Text>
            </Space>
            <Space size={4}>
              <EyeOutlined />
              <Text type="secondary">{t('common.views', { count: question.views })}</Text>
            </Space>
            {question.tags.map((tag) => (
              <TagChip key={tag.id} tag={tag} />
            ))}
          </Space>
        </div>
      </Space>
    </Card>
  );
}