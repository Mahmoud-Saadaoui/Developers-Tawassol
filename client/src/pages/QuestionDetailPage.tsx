import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  App as AntdApp,
  Avatar,
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
import Markdown from '../components/common/Markdown';
import MarkdownEditor from '../components/common/MarkdownEditor';
import VoteButtons from '../components/question/VoteButtons';
import TagChip from '../components/question/TagChip';
import AnswerItem from '../components/question/AnswerItem';
import EditQuestionForm from '../components/question/EditQuestionForm';

const { Title, Text } = Typography;

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { message } = AntdApp.useApp();

  const { data: question, isLoading } = useQuestion(id!);
  const { data: answers } = useAnswers(id!);
  const createAnswer = useCreateAnswer();
  const acceptAnswer = useAcceptAnswer();
  const deleteQuestion = useDeleteQuestion();

  const [answerContent, setAnswerContent] = useState('');
  const [editing, setEditing] = useState(false);

  if (isLoading) return <Empty description="Chargement..." />;
  if (!question) return <Empty description="Question introuvable" />;

  const isAuthor = user?.id === question.author.id;

  const handleAnswer = async () => {
    try {
      await createAnswer.mutateAsync({ questionId: id!, content: answerContent });
      setAnswerContent('');
      message.success('Réponse publiée !');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleAccept = async (answerId: string) => {
    try {
      await acceptAnswer.mutateAsync({ questionId: id!, answerId });
      message.success('Réponse acceptée !');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion.mutateAsync(id!);
      message.success('Question supprimée');
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
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
                  <Avatar size={24} src={question.author.avatar?.url} />
                  <Text type="secondary">{question.author.name}</Text>
                </Space>
                <Text type="secondary">
                  {new Date(question.createdAt).toLocaleDateString()}
                </Text>
                <Text type="secondary">{question.views} vues</Text>
              </Space>
              <Markdown content={question.content} />
              <Space style={{ marginTop: 12 }} wrap>
                {question.tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} />
                ))}
              </Space>
              {isAuthor && (
                <Space style={{ marginTop: 12 }}>
                  <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                    Modifier
                  </Button>
                  <Popconfirm
                    title="Supprimer cette question ?"
                    description="Toutes les réponses seront également supprimées."
                    okText="Supprimer"
                    cancelText="Annuler"
                    onConfirm={handleDelete}
                  >
                    <Button danger size="small" icon={<DeleteOutlined />}>
                      Supprimer
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
        {answers?.length ?? 0} réponse(s)
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
          <Title level={5}>Votre réponse</Title>
          <MarkdownEditor
            value={answerContent}
            onChange={setAnswerContent}
            placeholder="Écrivez votre réponse (Markdown supporté)"
            minRows={4}
          />
          <Button
            type="primary"
            style={{ marginTop: 12 }}
            onClick={handleAnswer}
            loading={createAnswer.isPending}
          >
            Publier la réponse
          </Button>
        </Card>
      ) : (
        <Card style={{ marginTop: 24 }}>
          <Link to="/login">Connectez-vous</Link> pour répondre à cette question.
        </Card>
      )}
    </div>
  );
}
