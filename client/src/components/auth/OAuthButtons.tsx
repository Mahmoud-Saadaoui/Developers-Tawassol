import { Button } from 'antd';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { useLocale } from '../../context/LocaleContext';

type OAuthProvider = 'google' | 'github';

interface OAuthButtonsProps {
  /** Where to send the visitor to start the OAuth flow. */
  onSelect?: (provider: OAuthProvider) => void;
}

/**
 * OAuth sign-in buttons with each provider's brand color
 * (Google blue / GitHub black — see `.oauth-btn-*` in `index.css`).
 */
export default function OAuthButtons({ onSelect }: OAuthButtonsProps) {
  const { t } = useLocale();

  const start = (provider: OAuthProvider) => {
    if (onSelect) {
      onSelect(provider);
      return;
    }
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      <Button
        className="oauth-btn oauth-btn-google"
        icon={<GoogleOutlined />}
        onClick={() => start('google')}
      >
        {t('auth.continueGoogle')}
      </Button>
      <Button
        className="oauth-btn oauth-btn-github"
        icon={<GithubOutlined />}
        onClick={() => start('github')}
      >
        {t('auth.continueGithub')}
      </Button>
    </div>
  );
}
