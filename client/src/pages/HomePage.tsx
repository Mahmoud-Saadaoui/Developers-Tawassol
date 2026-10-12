import { useSearchParams } from 'react-router-dom';
import { Button, Empty, Input, Pagination, Segmented, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import QuestionCard from '../components/question/QuestionCard';

const { Title } = Typography;

type SortOption = 'newest' | 'votes' | 'unanswered';

export default function HomePage() {
  const { t } = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const page = Number(searchParams.get('page') ?? 1);
  const sort = (searchParams.get('sort') as SortOption) ?? 'newest';
  const search = searchParams.get('search') ?? '';

  const { data, isLoading } = useQuestions({ page, sort, search: search || undefined });

  const handleSort = (value: string) => {
    setSearchParams({ sort: value, page: '1', ...(search ? { search } : {}) });
  };

  const handlePage = (p: number) => {
    setSearchParams({ sort, page: String(p), ...(search ? { search } : {}) });
  };

  const handleSearch = (value: string) => {
    const term = value.trim();
    setSearchParams({ sort, page: '1', ...(term ? { search: term } : {}) });
  };

  return (
    <div>
      <Space align="center" style={{ width: '100%', marginBottom: 16 }}>
        <Title level={2} style={{ margin: 0, flex: 1 }}>
          {t('home.title')}
        </Title>
        {user && (
          <Link to="/ask">
            <Button type="primary" icon={<PlusOutlined />}>
              {t('home.ask')}
            </Button>
          </Link>
        )}
      </Space>

      <Space style={{ marginBottom: 16 }} wrap>
        <Segmented
          value={sort}
          onChange={handleSort}
          options={[
            { label: t('home.sortNewest'), value: 'newest' },
            { label: t('home.sortVotes'), value: 'votes' },
            { label: t('home.sortUnanswered'), value: 'unanswered' },
          ]}
        />
        <Input.Search
          defaultValue={search}
          placeholder={t('home.searchPlaceholder')}
          allowClear
          onSearch={handleSearch}
          style={{ width: 280 }}
        />
      </Space>

      {isLoading ? (
        <Empty description={t('common.loading')} />
      ) : !data?.items.length ? (
        <Empty description={t(search ? 'home.noResults' : 'home.empty')} />
      ) : (
        <>
          {data.items.map((q) => (
            <QuestionCard key={q.id} question={q} />
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
