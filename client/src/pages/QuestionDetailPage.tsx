import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  App as AntdApp,
  Button,
  Card,
  Empty,
  List,
  Popconfirm,
  Space,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  useQuestion,
  useAnswers,
  useCreateAnswer,
  useAcceptAnswer,
  useDeleteQuestion,
} from '../hooks/useQuestions';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import { formatDate } from '../utils/date';
import Markdown from '../components/common/Markdown';
import MarkdownEditor from '../components/common/MarkdownEditor';
import VoteButtons from '../components/question/VoteButtons';
import TagChip from '../components/question/TagChip';
import AnswerItem from '../components/question/AnswerItem';
import EditQuestionForm from '../components/question/EditQuestionForm';
import UserAvatar from '../components/common/UserAvatar';

const { Title, Text } = Typography;

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocale();
  const { message } = AntdApp.useApp();

  const { data: question, isLoading } = useQuestion(id!);
  const { data: answers } = useAnswers(id!);
  const createAnswer = useCreateAnswer();
  const acceptAnswer = useAcceptAnswer();
  const deleteQuestion = useDeleteQuestion();

  const [answerContent, setAnswerContent] = useState('');
  const [editing, setEditing] = useState(false);

  if (isLoading) return <Empty description={t('common.loading')} />;
  if (!question) return <Empty description={t('questionDetail.notFound')} />;

  const isAuthor = user?.id === question.author?.id;

  const handleAnswer = async () => {
    try {
      await createAnswer.mutateAsync({ questionId: id!, content: answerContent });
      setAnswerContent('');
      message.success(t('questionDetail.answerSuccess'));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleAccept = async (answerId: string) => {
    try {
      await acceptAnswer.mutateAsync({ questionId: id!, answerId });
      message.success(t('questionDetail.acceptSuccess'));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion.mutateAsync(id!);
      message.success(t('questionDetail.deleteSuccess'));
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <div>
      {/* Question */}
      <Card>
        {editing ? (
          <EditQuestionForm
            question={question}
            onCancel={() => setEditing(false)}
            onSaved={() => setEditing(false)}
          />
        ) : (
          <Space align="start" style={{ width: '100%' }}>
            <VoteButtons
              postId={question.id}
              votesTotal={question.votesTotal}
              votes={question.votes}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={3}>{question.title}</Title>
              <Space size={16} style={{ marginBottom: 12 }} wrap>
                <Space size={4}>
                  <UserAvatar size={24} user={question.author} />
                  <Text type="secondary">
                    {question.author?.name ?? t('common.deletedUser')}
                  </Text>
                </Space>
                <Text type="secondary">{formatDate(question.createdAt)}</Text>
                <Text type="secondary">
                  {t('common.views', { count: question.views })}
                </Text>
              </Space>
              <Markdown content={question.content} />
              <Space style={{ marginTop: 12 }} wrap>
                {question.tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </Space>
              {isAuthor && (
                <Space style={{ marginTop: 12 }}>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    {t('questionDetail.edit')}
                  </Button>
                  <Popconfirm
                    title={t('questionDetail.deleteTitle')}
                    description={t('questionDetail.deleteDescription')}
                    okText={t('common.delete')}
                    cancelText={t('common.cancel')}
                    onConfirm={handleDelete}
                  >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                      {t('questionDetail.delete')}
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            </div>
          </Space>
        )}
      </Card>

      {/* Answers */}
      <Title level={4} style={{ marginTop: 24 }}>
        {t('common.answers', { count: answers?.length ?? 0 })}
      </Title>

      <List
        dataSource={answers ?? []}
        renderItem={(answer) => (
          <List.Item>
            <AnswerItem
              answer={answer}
              isQuestionAuthor={!!isAuthor}
              isAccepted={question.acceptedAnswer === answer.id}
              onAccept={handleAccept}
            />
          </List.Item>
        )}
      />

      {/* Add answer */}
      {user ? (
        <Card style={{ marginTop: 24 }}>
          <Title level={5}>{t('questionDetail.yourAnswer')}</Title>
          <MarkdownEditor
            value={answerContent}
            onChange={setAnswerContent}
            placeholder={t('questionDetail.answerPlaceholder')}
            minRows={4}
          />
          <Button
            type="primary"
            style={{ marginTop: 12 }}
            onClick={handleAnswer}
            loading={createAnswer.isPending}
          >
            {t('questionDetail.publishAnswer')}
          </Button>
        </Card>
      ) : (
        <Card style={{ marginTop: 24 }}>
          <Link to="/login">{t('questionDetail.loginToAnswerLogin')}</Link>{' '}
          {t('questionDetail.loginToAnswerSuffix')}
        </Card>
      )}
    </div>
  );
}
