import { Divider, Tag, Typography } from 'antd';
import { useLocale } from '../../context/LocaleContext';
import { formatMonthYear } from '../../utils/date';
import type { Education } from '../../types';

const { Text } = Typography;

function formatRange(edu: Education, presentLabel: string): string {
  const from = formatMonthYear(edu.from);
  const to = edu.current ? presentLabel : edu.to ? formatMonthYear(edu.to) : '';
  return `${from} — ${to}`;
}

interface EducationListProps {
  items: Education[];
}

export default function EducationList({ items }: EducationListProps) {
  const { t } = useLocale();
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
            <Tag color={edu.current ? 'green' : 'default'}>
              {formatRange(edu, t('education.present'))}
            </Tag>
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
