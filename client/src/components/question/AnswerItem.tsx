import { useState } from 'react';
import { App as AntdApp, Avatar, Button, Card, Popconfirm, Space, Tag, Typography } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useUpdateAnswer, useDeleteAnswer } from '../../hooks/useQuestions';
import Markdown from '../common/Markdown';
import MarkdownEditor from '../common/MarkdownEditor';
import VoteButtons from './VoteButtons';

const { Text } = Typography;

interface AnswerItemProps {
  answer: Post;
  isQuestionAuthor: boolean;
  isAccepted: boolean;
  onAccept: (answerId: string) => void;
}

/** A single answer, with vote / edit / delete / accept controls. */
export default function AnswerItem({
  answer,
  isQuestionAuthor,
  isAccepted,
  onAccept,
}: AnswerItemProps) {
  const { user } = useAuth();
  const { message } = AntdApp.useApp();
  const updateAnswer = useUpdateAnswer();
  const deleteAnswer = useDeleteAnswer();

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(answer.content);

  const isAuthor = user?.id === answer.author.id;

  const handleSave = async () => {
    try {
      await updateAnswer.mutateAsync({ id: answer.id, content });
      setEditing(false);
      message.success('Réponse modifiée');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnswer.mutateAsync(answer.id);
      message.success('Réponse supprimée');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <Card
      size="small"
      style={{ width: '100%', borderColor: isAccepted ? '#52c41a' : undefined }}
    >
      <Space align="start" style={{ width: '100%' }}>
        <VoteButtons postId={answer.id} votesTotal={answer.votesTotal} votes={answer.votes} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {isAccepted && (
            <Tag color="success" icon={<CheckOutlined />} style={{ marginBottom: 8 }}>
              Réponse acceptée
            </Tag>
          )}

          {editing ? (
            <>
              <MarkdownEditor value={content} onChange={setContent} minRows={4} />
              <Space style={{ marginTop: 8 }}>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleSave}
                  loading={updateAnswer.isPending}
                >
                  Enregistrer
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(false);
                    setContent(answer.content);
                  }}
                >
                  Annuler
                </Button>
              </Space>
            </>
          ) : (
            <Markdown content={answer.content} />
          )}

          <Space size={16} style={{ marginTop: 8 }} wrap>
            <Space size={4}>
              <Avatar size={20} src={answer.author.avatar?.url} />
              <Text type="secondary">{answer.author.name}</Text>
            </Space>
            <Text type="secondary">{new Date(answer.createdAt).toLocaleDateString()}</Text>

            {isQuestionAuthor && !isAccepted && (
              <Button size="small" icon={<CheckOutlined />} onClick={() => onAccept(answer.id)}>
                Accepter
              </Button>
            )}

            {isAuthor && !editing && (
              <Space size={8}>
                <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  Modifier
                </Button>
                <Popconfirm
                  title="Supprimer cette réponse ?"
                  okText="Supprimer"
                  cancelText="Annuler"
                  onConfirm={handleDelete}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    Supprimer
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );
}
