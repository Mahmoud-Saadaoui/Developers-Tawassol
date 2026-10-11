import { Button, Space, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useVote } from '../../hooks/useQuestions';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface VoteButtonsProps {
  postId: string;
  votesTotal: number;
  /** Raw votes, used to highlight the current user's choice. */
  votes?: Array<{ user: string; value: number }>;
  vertical?: boolean;
}

export default function VoteButtons({
  postId,
  votesTotal,
  votes,
  vertical = true,
}: VoteButtonsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const vote = useVote();

  const myVote = votes?.find((v) => v.user === user?.id)?.value;

  const handleVote = (value: 1 | -1) => {
    if (!user) {
      navigate('/login');
      return;
    }
    vote.mutate({ postId, value });
  };

  return (
    <Space direction={vertical ? 'vertical' : 'horizontal'} size={4} align="center">
      <Button
        type={myVote === 1 ? 'primary' : 'text'}
        size="small"
        icon={<ArrowUpOutlined />}
        onClick={() => handleVote(1)}
        loading={vote.isPending}
        aria-label="Upvote"
      />
      <Typography.Text strong style={{ fontSize: 16 }}>
        {votesTotal}
      </Typography.Text>
      <Button
        type={myVote === -1 ? 'primary' : 'text'}
        size="small"
        icon={<ArrowDownOutlined />}
        onClick={() => handleVote(-1)}
        loading={vote.isPending}
        aria-label="Downvote"
      />
    </Space>
  );
}
