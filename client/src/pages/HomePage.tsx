import { Empty, Typography } from 'antd';

export default function HomePage() {
  return (
    <div>
      <Typography.Title level={2}>Questions</Typography.Title>
      <Empty description="Aucune question pour le moment" />
    </div>
  );
}
