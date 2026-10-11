import { useSearchParams } from 'react-router-dom';
import { Button, Empty, Pagination, Segmented, Space, Typography } from 'antd';
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

  const { data, isLoading } = useQuestions({ page, sort });

  const handleSort = (value: string) => {
    setSearchParams({ sort: value, page: '1' });
  };

  const handlePage = (p: number) => {
    setSearchParams({ sort, page: String(p) });
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

      <Segmented
        value={sort}
        onChange={handleSort}
        options={[
          { label: t('home.sortNewest'), value: 'newest' },
          { label: t('home.sortVotes'), value: 'votes' },
          { label: t('home.sortUnanswered'), value: 'unanswered' },
        ]}
        style={{ marginBottom: 16 }}
      />

      {isLoading ? (
        <Empty description={t('common.loading')} />
      ) : !data?.items.length ? (
        <Empty description={t('home.empty')} />
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