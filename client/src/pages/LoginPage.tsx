import { Button, Card, Divider, Form, Input, Typography, App as AntdApp } from 'antd';
import { GithubOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values.email, values.password);
      message.success('Connecté !');
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Typography.Title level={3}>Connexion</Typography.Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <Button icon={<GoogleOutlined />} onClick={() => (window.location.href = '/api/auth/google')}>
          Continuer avec Google
        </Button>
        <Button icon={<GithubOutlined />} onClick={() => (window.location.href = '/api/auth/github')}>
          Continuer avec GitHub
        </Button>
        <Button icon={<LinkedinOutlined />} onClick={() => (window.location.href = '/api/auth/linkedin')}>
          Continuer avec LinkedIn
        </Button>
      </div>

      <Divider>ou</Divider>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Email invalide' }]}
        >
          <Input type="email" autoComplete="email" />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: 'Mot de passe requis' }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        Pas encore de compte ? <Link to="/register">S'inscrire</Link>
      </Typography.Text>
    </Card>
  );
}
