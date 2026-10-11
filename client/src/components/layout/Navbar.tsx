import { App as AntdApp, Button, Dropdown, Space } from 'antd';
import { LogoutOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale } = useLocale();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleLogout = async () => {
    await logout();
    message.success('Déconnecté');
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Space size={16}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
          Tawassol
        </Link>
        <Link to="/tags">Tags</Link>
      </Space>

      <Space>
        <Button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
          {locale === 'en' ? 'العربية' : 'EN'}
        </Button>

        {user ? (
          <>
            <Link to="/ask">
              <Button type="primary" icon={<PlusOutlined />}>
                Poser une question
              </Button>
            </Link>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Se déconnecter',
                    onClick: handleLogout,
                  },
                ],
              }}
            >
              <Button icon={<UserOutlined />}>{user.name}</Button>
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">S'inscrire</Button>
            </Link>
          </>
        )}
      </Space>
    </div>
  );
}
