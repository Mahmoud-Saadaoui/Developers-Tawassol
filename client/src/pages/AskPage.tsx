import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp, Button, Card, Form, Input, Select, Space, Typography } from 'antd';
import { useCreateQuestion, useTags } from '../hooks/useQuestions';
import { useLocale } from '../context/LocaleContext';
import MarkdownEditor from '../components/common/MarkdownEditor';

const { Title } = Typography;

export default function AskPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { t } = useLocale();
  const createQuestion = useCreateQuestion();
  const { data: tags } = useTags();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const onFinish = async () => {
    try {
      const question = await createQuestion.mutateAsync({
        title,
        content,
        tags: selectedTags,
      });
      message.success(t('ask.success'));
      navigate(`/questions/${question.id}`);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3}>{t('ask.title')}</Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t('ask.titleLabel')}
          required
          rules={[{ required: true, min: 10, message: t('ask.titleRequired') }]}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('ask.titleLabel')}
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label={t('ask.tagsLabel')}
          required
          rules={[{ required: true, message: t('ask.tagsRequired') }]}
        >
          <Select
            mode="multiple"
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder={t('ask.tagsPlaceholder')}
            options={(tags ?? []).map((tag) => ({ label: tag.name, value: tag.id }))}
            maxCount={5}
          />
        </Form.Item>

        <Form.Item
          label={t('ask.contentLabel')}
          required
          rules={[{ required: true, min: 20, message: t('ask.contentRequired') }]}
        >
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder={t('ask.contentPlaceholder')}
            minRows={8}
          />
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={createQuestion.isPending}
          >
            {t('common.publish')}
          </Button>
          <Button onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
        </Space>
      </Form>
    </Card>
  );
}