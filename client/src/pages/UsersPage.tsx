import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, Input, Pagination, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useUsers } from '../hooks/useUsers';
import UserCard from '../components/profile/UserCard';

const { Title } = Typography;

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const searchFromUrl = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(searchFromUrl);

  const { data, isLoading } = useUsers({ page, search: searchFromUrl || undefined });

  const handleSearch = (value: string) => {
    setSearch(value);
    setSearchParams({ search: value, page: '1' });
  };

  const handlePage = (p: number) => {
    setSearchParams({ search: searchFromUrl, page: String(p) });
  };

  return (
    <div>
      <Title level={2}>Développeurs</Title>

      <Input
        placeholder="Rechercher un développeur…"
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onPressEnter={() => handleSearch(search)}
        allowClear
        onClear={() => handleSearch('')}
        style={{ maxWidth: 400, marginBottom: 16 }}
      />

      {isLoading ? (
        <Empty description="Chargement..." />
      ) : !data?.items.length ? (
        <Empty description="Aucun développeur trouvé" />
      ) : (
        <>
          {data.items.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
          <Pagination
            current={page}
            total={data.total}
            pageSize={10}
            onChange={handlePage}
            style={{ marginTop: 16, textAlign: 'center' }}
          />
        </>
      )}
    </div>
  );
}