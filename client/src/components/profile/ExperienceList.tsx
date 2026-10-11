import { Divider, Tag, Typography } from 'antd';
import { useLocale } from '../../context/LocaleContext';
import { formatMonthYear } from '../../utils/date';
import type { Experience } from '../../types';

const { Text } = Typography;

function formatRange(exp: Experience, presentLabel: string): string {
  const from = formatMonthYear(exp.from);
  const to = exp.current ? presentLabel : exp.to ? formatMonthYear(exp.to) : '';
  return `${from} — ${to}`;
}

interface ExperienceListProps {
  items: Experience[];
}

export default function ExperienceList({ items }: ExperienceListProps) {
  const { t } = useLocale();
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
            <Tag color={exp.current ? 'green' : 'default'}>
              {formatRange(exp, t('experience.present'))}
            </Tag>
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