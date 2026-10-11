import { useState } from 'react';
import { App as AntdApp, Avatar, Button, Card, Popconfirm, Space, Tag, Typography } from 'antd';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { formatDate } from '../../utils/date';
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
  const { t } = useLocale();
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
      message.success(t('answerItem.saveSuccess'));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAnswer.mutateAsync(answer.id);
      message.success(t('answerItem.deleteSuccess'));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
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
              {t('answerItem.accepted')}
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
                  {t('common.save')}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setEditing(false);
                    setContent(answer.content);
                  }}
                >
                  {t('common.cancel')}
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
            <Text type="secondary">{formatDate(answer.createdAt)}</Text>

            {isQuestionAuthor && !isAccepted && (
              <Button size="small" icon={<CheckOutlined />} onClick={() => onAccept(answer.id)}>
                {t('common.accept')}
              </Button>
            )}

            {isAuthor && !editing && (
              <Space size={8}>
                <Button size="small" icon={<EditOutlined />} onClick={() => setEditing(true)}>
                  {t('common.edit')}
                </Button>
                <Popconfirm
                  title={t('answerItem.deleteTitle')}
                  okText={t('common.delete')}
                  cancelText={t('common.cancel')}
                  onConfirm={handleDelete}
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    {t('common.delete')}
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