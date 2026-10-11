import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp, Button, Card, Form, Input, Select, Space, Typography } from 'antd';
import { useCreateQuestion, useTags } from '../hooks/useQuestions';
import MarkdownEditor from '../components/common/MarkdownEditor';

const { Title } = Typography;

export default function AskPage() {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
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
      message.success('Question publiée !');
      navigate(`/questions/${question.id}`);
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3}>Poser une question</Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Titre"
          required
          rules={[{ required: true, min: 10, message: 'Minimum 10 caractères' }]}
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Votre titre de question"
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label="Tags"
          required
          rules={[{ required: true, message: 'Sélectionnez au moins un tag' }]}
        >
          <Select
            mode="multiple"
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Sélectionnez des tags"
            options={(tags ?? []).map((t) => ({ label: t.name, value: t.id }))}
            maxCount={5}
          />
        </Form.Item>

        <Form.Item
          label="Détails"
          required
          rules={[{ required: true, min: 20, message: 'Minimum 20 caractères' }]}
        >
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Décrivez votre question en détail (Markdown supporté)"
            minRows={8}
          />
        </Form.Item>

        <Space>
          <Button
            type="primary"
            htmlType="submit"
            loading={createQuestion.isPending}
          >
            Publier
          </Button>
          <Button onClick={() => navigate(-1)}>Annuler</Button>
        </Space>
      </Form>
    </Card>
  );
}
