import { App as AntdApp, Button, Card, Divider, Form, Input, Typography } from 'antd';
import { GithubOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { t } = useLocale();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('auth.loginError'));
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Typography.Title level={3}>{t('auth.loginTitle')}</Typography.Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <Button icon={<GoogleOutlined />} onClick={() => (window.location.href = '/api/auth/google')}>
          {t('auth.continueGoogle')}
        </Button>
        <Button icon={<GithubOutlined />} onClick={() => (window.location.href = '/api/auth/github')}>
          {t('auth.continueGithub')}
        </Button>
        <Button icon={<LinkedinOutlined />} onClick={() => (window.location.href = '/api/auth/linkedin')}>
          {t('auth.continueLinkedin')}
        </Button>
      </div>

      <Divider>{t('common.or')}</Divider>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t('auth.email')}
          name="email"
          rules={[{ required: true, type: 'email', message: t('auth.emailInvalid') }]}
        >
          <Input type="email" autoComplete="email" />
        </Form.Item>
        <Form.Item
          label={t('auth.password')}
          name="password"
          rules={[{ required: true, message: t('auth.passwordRequired') }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('auth.loginTitle')}
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
      </Typography.Text>
    </Card>
  );
}