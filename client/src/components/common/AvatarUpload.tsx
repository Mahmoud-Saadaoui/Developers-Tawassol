import { Avatar, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useUploadAvatar } from '../../hooks/useUpload';

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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-circle"
      showUploadList={false}
      beforeUpload={() => false}
      onChange={handleChange}
      disabled={loading}
    >
      {user?.avatar?.url ? (
        <Avatar size={size} src={user.avatar.url} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}