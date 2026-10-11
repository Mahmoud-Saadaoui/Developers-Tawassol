import { App as AntdApp, Button, Dropdown, Space, Tooltip } from 'antd';
import {
  BulbOutlined,
  IdcardOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleLogout = async () => {
    await logout();
    message.success(t('nav.logout'));
    navigate('/');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
      }}
    >
      <Space size={16}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
          {t('nav.brand')}
        </Link>
        <Link to="/tags">{t('nav.tags')}</Link>
        <Link to="/users">{t('nav.users')}</Link>
      </Space>

      <Space>
        <Button onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}>
          {locale === 'en' ? 'العربية' : 'EN'}
        </Button>

        <Tooltip title={isDark ? t('nav.themeLight') : t('nav.themeDark')}>
          <Button
            icon={<BulbOutlined />}
            onClick={toggle}
            aria-label={isDark ? t('nav.themeLight') : t('nav.themeDark')}
          />
        </Tooltip>

        {user ? (
          <>
            <Link to="/ask">
              <Button type="primary" icon={<PlusOutlined />}>
                {t('nav.ask')}
              </Button>
            </Link>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <IdcardOutlined />,
                    label: t('nav.myProfile'),
                    onClick: () => navigate('/dashboard'),
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: t('nav.logout'),
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
              <Button>{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">{t('nav.register')}</Button>
            </Link>
          </>
        )}
      </Space>
    </div>
  );
}