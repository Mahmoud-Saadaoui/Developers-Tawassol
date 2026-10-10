import { Button, Card, Divider, Form, Input, Typography, App as AntdApp } from 'antd';
import { GithubOutlined, GoogleOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      await register(values.name, values.email, values.password);
      message.success('Compte créé !');
      navigate('/');
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Typography.Title level={3}>Inscription</Typography.Title>

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
          label="Nom"
          name="name"
          rules={[{ required: true, min: 2, message: 'Nom requis (min. 2 caractères)' }]}
        >
          <Input autoComplete="name" />
        </Form.Item>
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
          rules={[{ required: true, min: 8, message: 'Minimum 8 caractères' }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
      <Typography.Text type="secondary">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </Typography.Text>
    </Card>
  );
}
