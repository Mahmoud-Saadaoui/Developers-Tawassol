import { useParams } from 'react-router-dom';
import { Empty, List, Typography } from 'antd';
import { useTags, useQuestions } from '../hooks/useQuestions';
import { useLocale } from '../context/LocaleContext';
import QuestionCard from '../components/question/QuestionCard';

const { Title } = Typography;

export default function TagDetailPage() {
  const { t } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const { data: tags } = useTags();
  const tag = tags?.find((tg) => tg.slug === slug);
  const { data: questions, isLoading } = useQuestions({ tag: tag?.id });

  if (!tag) return <Empty description={t('tagDetail.notFound')} />;

  return (
    <div>
      <Title level={2}>{tag.name}</Title>
      {tag.description && <Typography.Paragraph type="secondary">{tag.description}</Typography.Paragraph>}
      <Typography.Text type="secondary">
        {t('common.questions', { count: tag.questionsCount })}
      </Typography.Text>

      <List
        style={{ marginTop: 16 }}
        loading={isLoading}
        dataSource={questions?.items ?? []}
        renderItem={(q) => <QuestionCard key={q.id} question={q} />}
        locale={{ emptyText: <Empty description={t('tagDetail.empty')} /> }}
      />
    </div>
  );
}