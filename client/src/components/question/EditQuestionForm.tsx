import { useState } from 'react';
import { App as AntdApp, Button, Form, Input, Select, Space } from 'antd';
import { useTags, useUpdateQuestion } from '../../hooks/useQuestions';
import type { Post } from '../../types';
import MarkdownEditor from '../common/MarkdownEditor';

interface EditQuestionFormProps {
  question: Post;
  onCancel: () => void;
  onSaved: () => void;
}

/** Inline form used to edit an existing question (author only). */
export default function EditQuestionForm({ question, onCancel, onSaved }: EditQuestionFormProps) {
  const { message } = AntdApp.useApp();
  const { data: tags } = useTags();
  const updateQuestion = useUpdateQuestion();

  const [title, setTitle] = useState(question.title ?? '');
  const [content, setContent] = useState(question.content);
  const [selectedTags, setSelectedTags] = useState<string[]>(question.tags.map((t) => t.id));

  const handleSave = async () => {
    try {
      await updateQuestion.mutateAsync({
        id: question.id,
        data: { title, content, tags: selectedTags },
      });
      message.success('Question modifiée');
      onSaved();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Titre" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
      </Form.Item>

      <Form.Item label="Tags" required>
        <Select
          mode="multiple"
          value={selectedTags}
          onChange={setSelectedTags}
          options={(tags ?? []).map((t) => ({ label: t.name, value: t.id }))}
          maxCount={5}
        />
      </Form.Item>

      <Form.Item label="Détails" required>
        <MarkdownEditor value={content} onChange={setContent} minRows={8} />
      </Form.Item>

      <Space>
        <Button type="primary" onClick={handleSave} loading={updateQuestion.isPending}>
          Enregistrer
        </Button>
        <Button onClick={onCancel}>Annuler</Button>
      </Space>
    </Form>
  );
}
