import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { Tag as TagType } from '../../types';

interface TagChipProps {
  tag: TagType;
}

export default function TagChip({ tag }: TagChipProps) {
  return (
    <Link to={`/tags/${tag.slug}`}>
      <Tag color="blue" style={{ cursor: 'pointer' }}>
        {tag.name}
      </Tag>
    </Link>
  );
}
