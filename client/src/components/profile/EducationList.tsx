import { Divider, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import type { Education } from '../../types';

const { Text } = Typography;

function formatDate(value?: string): string {
  return value ? dayjs(value).format('MMM YYYY') : '';
}

function formatRange(edu: Education): string {
  const from = formatDate(edu.from);
  const to = edu.current ? 'Present' : formatDate(edu.to);
  return `${from} — ${to}`;
}

interface EducationListProps {
  items: Education[];
}

export default function EducationList({ items }: EducationListProps) {
  if (!items.length) return null;

  return (
    <div>
      {items.map((edu, i) => (
        <div key={edu._id ?? i}>
          {i > 0 && <Divider style={{ margin: '12px 0' }} />}
          <Text strong>{edu.school}</Text>
          <Text> · {edu.degree}</Text>
          {edu.fieldofstudy && <Text type="secondary"> · {edu.fieldofstudy}</Text>}
          <div style={{ margin: '4px 0' }}>
            <Tag color={edu.current ? 'green' : 'default'}>{formatRange(edu)}</Tag>
          </div>
          {edu.description && (
            <Text type="secondary" style={{ display: 'block' }}>
              {edu.description}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
}