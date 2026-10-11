import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Empty, Pagination, Row, Space, Spin, Statistic, Tag, Typography } from 'antd';
import { useUser, useUserQuestions } from '../hooks/useUsers';
import ProfileHeader from '../components/profile/ProfileHeader';
import ExperienceList from '../components/profile/ExperienceList';
import EducationList from '../components/profile/EducationList';
import QuestionCard from '../components/question/QuestionCard';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUser(id);
  const { data: questionsData, isLoading: questionsLoading } = useUserQuestions(id, page);

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (!data) return <Empty description="Utilisateur introuvable" />;

  const { user, stats } = data;
  const profile = user.profile ?? {};

  return (
    <div>
      <ProfileHeader user={user} />

      {profile.bio && (
        <Card style={{ marginTop: 16 }}>
          <Typography.Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {profile.bio}
          </Typography.Paragraph>
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Questions" value={stats.questions} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Réponses" value={stats.answers} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Score" value={stats.votesTotal} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Vues" value={stats.views} />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Statistic title="Accep.ées" value={stats.acceptedAnswers} />
          </Col>
        </Row>
      </Card>

      {profile.skills && profile.skills.length > 0 && (
        <Card title="Compétences" style={{ marginTop: 16 }}>
          <Space wrap size={8}>
            {profile.skills.map((skill) => (
              <Tag key={skill} color="blue">
                {skill}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {profile.experience && profile.experience.length > 0 && (
        <Card title="Expérience" style={{ marginTop: 16 }}>
          <ExperienceList items={profile.experience} />
        </Card>
      )}

      {profile.education && profile.education.length > 0 && (
        <Card title="Formation" style={{ marginTop: 16 }}>
          <EducationList items={profile.education} />
        </Card>
      )}

      <Card title="Questions posées" style={{ marginTop: 16 }}>
        {questionsLoading ? (
          <Empty description="Chargement..." />
        ) : !questionsData?.items.length ? (
          <Empty description="Aucune question" />
        ) : (
          <>
            {questionsData.items.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
            <Pagination
              current={page}
              total={questionsData.total}
              pageSize={10}
              onChange={setPage}
              hideOnSinglePage
              style={{ marginTop: 16, textAlign: 'center' }}
            />
          </>
        )}
      </Card>
    </div>
  );
}