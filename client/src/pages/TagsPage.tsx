import { Card, List, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useTags } from '../hooks/useQuestions';

const { Title } = Typography;

export default function TagsPage() {
  const { data: tags, isLoading } = useTags();

  return (
    <div>
      <Title level={2}>Tags</Title>
      <Card>
        <List
          loading={isLoading}
          dataSource={tags ?? []}
          renderItem={(tag) => (
            <List.Item>
              <Link to={`/tags/${tag.slug}`}>
                <Tag color="blue">{tag.name}</Tag>
              </Link>
              <Typography.Text type="secondary">
                {tag.questionsCount} question(s)
              </Typography.Text>
            </List.Item>
          )}
          locale={{ emptyText: 'Aucun tag' }}
        />
      </Card>
    </div>
  );
}
