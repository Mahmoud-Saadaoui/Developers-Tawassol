import { Card, List, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useTags } from '../hooks/useQuestions';
import { useLocale } from '../context/LocaleContext';

const { Title } = Typography;

export default function TagsPage() {
  const { t } = useLocale();
  const { data: tags, isLoading } = useTags();

  return (
    <div>
      <Title level={2}>{t('tags.title')}</Title>
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
                {t('common.questions', { count: tag.questionsCount })}
              </Typography.Text>
            </List.Item>
          )}
          locale={{ emptyText: t('tags.empty') }}
        />
      </Card>
    </div>
  );
}
