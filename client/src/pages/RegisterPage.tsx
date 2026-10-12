import { App as AntdApp, Button, Card, Divider, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import OAuthButtons from '../components/auth/OAuthButtons';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const { t } = useLocale();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      await register(values.name, values.email, values.password);
      message.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('auth.registerError'));
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Typography.Title level={3}>{t('auth.registerTitle')}</Typography.Title>

      <OAuthButtons />

      <Divider>{t('common.or')}</Divider>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t('auth.name')}
          name="name"
          rules={[{ required: true, min: 2, message: t('auth.nameRequired') }]}
        >
          <Input autoComplete="name" />
        </Form.Item>
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
          rules={[{ required: true, min: 8, message: t('auth.passwordMin') }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t('auth.registerTitle')}
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        {t('auth.haveAccount')} <Link to="/login">{t('nav.login')}</Link>
      </Typography.Text>
    </Card>
  );
}
