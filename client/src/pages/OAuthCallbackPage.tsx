import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export default function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { t } = useLocale();
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
        title={t('auth.oauthFailed')}
        extra={
          <Button type="primary" onClick={() => navigate('/login')}>
            {t('auth.oauthRetry')}
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spin size="large" tip={t('auth.oauthLoading')} />
    </div>
  );
}