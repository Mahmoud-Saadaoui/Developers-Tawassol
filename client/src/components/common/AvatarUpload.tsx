import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useUploadAvatar } from '../../hooks/useUpload';
import UserAvatar from './UserAvatar';

interface AvatarUploadProps {
  size?: number;
}

export default function AvatarUpload({ size = 128 }: AvatarUploadProps) {
  const { user, refreshUser } = useAuth();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const uploadAvatar = useUploadAvatar();

  const handleChange = async (info: { file: { originFileObj?: File } }) => {
    const file = info.file.originFileObj;
    if (!file) return;

    setLoading(true);
    try {
      await uploadAvatar.mutateAsync(file);
      await refreshUser();
    } catch {
      // error handled by mutation
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload
      name="avatar"
      showUploadList={false}
      beforeUpload={() => false}
      onChange={handleChange}
      disabled={loading}
    >
      <div className="avatar-upload" style={{ width: size, height: size }}>
        <UserAvatar size={size} user={user} />
        <div className="avatar-upload-overlay">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <span style={{ fontSize: 12 }}>{t('common.upload')}</span>
        </div>
      </div>
    </Upload>
  );
}
