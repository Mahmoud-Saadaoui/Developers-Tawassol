import { useState } from 'react';
import { App as AntdApp, Button, Form, Input, Select, Space } from 'antd';
import { useTags, useUpdateQuestion } from '../../hooks/useQuestions';
import { useLocale } from '../../context/LocaleContext';
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
  const { t } = useLocale();
  const { data: tags } = useTags();
  const updateQuestion = useUpdateQuestion();

  const [title, setTitle] = useState(question.title ?? '');
  const [content, setContent] = useState(question.content);
  const [selectedTags, setSelectedTags] = useState<string[]>(question.tags.map((tag) => tag.id));

  const handleSave = async () => {
    try {
      await updateQuestion.mutateAsync({
        id: question.id,
        data: { title, content, tags: selectedTags },
      });
      message.success(t('editQuestion.success'));
      onSaved();
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label={t('editQuestion.titleLabel')} required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
      </Form.Item>

      <Form.Item label={t('editQuestion.tagsLabel')} required>
        <Select
          mode="multiple"
          value={selectedTags}
          onChange={setSelectedTags}
          options={(tags ?? []).map((tag) => ({ label: tag.name, value: tag.id }))}
          maxCount={5}
        />
      </Form.Item>

      <Form.Item label={t('editQuestion.contentLabel')} required>
        <MarkdownEditor value={content} onChange={setContent} minRows={8} />
      </Form.Item>

      <Space>
        <Button type="primary" onClick={handleSave} loading={updateQuestion.isPending}>
          {t('common.save')}
        </Button>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
      </Space>
    </Form>
  );
}