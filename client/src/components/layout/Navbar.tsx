import { App as AntdApp, Button, Dropdown, Space, Tooltip, type MenuProps } from 'antd';
import {
  BulbOutlined,
  CheckOutlined,
  GlobalOutlined,
  IdcardOutlined,
  LogoutOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useTheme } from '../../context/ThemeContext';
import UserAvatar from '../common/UserAvatar';

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

  const languageItems: MenuProps['items'] = [
    {
      key: 'en',
      icon: locale === 'en' ? <CheckOutlined /> : null,
      label: 'English',
      onClick: () => setLocale('en'),
    },
    {
      key: 'ar',
      icon: locale === 'ar' ? <CheckOutlined /> : null,
      label: 'العربية',
      onClick: () => setLocale('ar'),
    },
  ];

  const userMenuItems: MenuProps['items'] = user
    ? [
        {
          key: 'identity',
          disabled: true,
          label: (
            <div style={{ padding: '2px 0', minWidth: 160 }}>
              <div style={{ fontWeight: 600, lineHeight: 1.5 }}>{user.name}</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>{user.email}</div>
            </div>
          ),
        },
        { type: 'divider' },
        {
          key: 'profile',
          icon: <IdcardOutlined />,
          label: t('nav.myProfile'),
          onClick: () => navigate('/dashboard'),
        },
        {
          key: 'language',
          icon: <GlobalOutlined />,
          label: t('nav.language'),
          children: languageItems,
        },
        {
          key: 'theme',
          icon: <BulbOutlined />,
          label: isDark ? t('nav.themeLight') : t('nav.themeDark'),
          onClick: toggle,
        },
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: t('nav.logout'),
          danger: true,
          onClick: handleLogout,
        },
      ]
    : [];

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '12px 24px',
        borderBottom: '1px solid rgba(128, 128, 128, 0.2)',
      }}
    >
      <Space size={16} className="site-nav" wrap>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
          {t('nav.brand')}
        </Link>
        <Link to="/tags">{t('nav.tags')}</Link>
        <Link to="/users">{t('nav.users')}</Link>
      </Space>

      <Space>
        {user ? (
          <>
            <Link to="/ask">
              <Button type="primary" icon={<PlusOutlined />}>
                {t('nav.ask')}
              </Button>
            </Link>

            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Tooltip title={user.name} placement="bottom">
                <Button
                  type="text"
                  aria-label={t('nav.myProfile')}
                  style={{ height: 'auto', padding: 4 }}
                >
                  <UserAvatar size={36} user={user} />
                </Button>
              </Tooltip>
            </Dropdown>
          </>
        ) : (
          <>
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

            <Link to="/login">
              <Button>{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">{t('nav.register')}</Button>
            </Link>
          </>
        )}
      </Space>
    </header>
  );
}
