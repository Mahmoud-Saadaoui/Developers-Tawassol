import { Button, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';

export default function Navbar() {
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();

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
      <Link to="/" style={{ fontWeight: 700, fontSize: 18 }}>
        Tawassol
      </Link>

      <Space>
        <Button onClick={() => setLocale(locale === 'fr' ? 'ar' : 'fr')}>
          {locale === 'fr' ? 'العربية' : 'FR'}
        </Button>

        {user ? (
          <span>{user.name}</span>
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
