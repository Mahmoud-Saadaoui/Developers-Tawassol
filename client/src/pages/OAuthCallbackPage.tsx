import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const success = params.get('success') === '1';

  useEffect(() => {
    if (success) {
      refreshUser().finally(() => navigate('/', { replace: true }));
    }
  }, [success, refreshUser, navigate]);

  if (!success) {
    return (
      <Result
        status="error"
        title="Échec de la connexion"
        extra={
          <Button type="primary" onClick={() => navigate('/login')}>
            Réessayer
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spin size="large" tip="Connexion en cours..." />
    </div>
  );
}
