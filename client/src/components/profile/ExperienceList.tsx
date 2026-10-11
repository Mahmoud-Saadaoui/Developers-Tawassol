import { Divider, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import type { Experience } from '../../types';

const { Text } = Typography;

function formatDate(value?: string): string {
  return value ? dayjs(value).format('MMM YYYY') : '';
}

function formatRange(exp: Experience): string {
  const from = formatDate(exp.from);
  const to = exp.current ? 'Present' : formatDate(exp.to);
  return `${from} — ${to}`;
}

interface ExperienceListProps {
  items: Experience[];
}

export default function ExperienceList({ items }: ExperienceListProps) {
  if (!items.length) return null;

  return (
    <div>
      {items.map((exp, i) => (
        <div key={exp._id ?? i}>
          {i > 0 && <Divider style={{ margin: '12px 0' }} />}
          <Text strong>{exp.title}</Text>
          <Text> · {exp.company}</Text>
          {exp.location && <Text type="secondary"> · {exp.location}</Text>}
          <div style={{ margin: '4px 0' }}>
            <Tag color={exp.current ? 'green' : 'default'}>{formatRange(exp)}</Tag>
          </div>
          {exp.description && (
            <Text type="secondary" style={{ display: 'block' }}>
              {exp.description}
            </Text>
          )}
        </div>
      ))}
    </div>
  );
}