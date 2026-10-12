import { useState } from 'react';
import { Button, Space } from 'antd';
import { useLocale } from '../../context/LocaleContext';
import Markdown from './Markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minRows = 6,
}: MarkdownEditorProps) {
  const { t } = useLocale();
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <Space style={{ marginBottom: 8 }}>
        <Button
          size="small"
          type={preview ? 'default' : 'primary'}
          onClick={() => setPreview(false)}
        >
          {t('markdown.write')}
        </Button>
        <Button
          size="small"
          type={preview ? 'primary' : 'default'}
          onClick={() => setPreview(true)}
        >
          {t('markdown.preview')}
        </Button>
      </Space>

      {preview ? (
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            padding: 12,
            minHeight: 120,
          }}
        >
          {value ? (
            <Markdown content={value} />
          ) : (
            <em style={{ color: '#999' }}>{t('markdown.empty')}</em>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={minRows}
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            fontFamily: 'monospace',
            fontSize: 14,
            resize: 'vertical',
          }}
        />
      )}
    </div>
  );
}
