import {
  App as AntdApp,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import AvatarUpload from '../components/common/AvatarUpload';
import { useUpdateProfile } from '../hooks/useUsers';
import type { UserProfile } from '../types';

const { Title, Text } = Typography;

interface SocialFormValues {
  youtube?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
}

interface ExperienceFormEntry {
  title?: string;
  company?: string;
  location?: string;
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
  current?: boolean;
  description?: string;
}

interface EducationFormEntry {
  school?: string;
  degree?: string;
  fieldofstudy?: string;
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
  current?: boolean;
  description?: string;
}

interface ProfileFormValues {
  headline?: string;
  location?: string;
  website?: string;
  github?: string;
  bio?: string;
  skills?: string[];
  social?: SocialFormValues;
  experience?: ExperienceFormEntry[];
  education?: EducationFormEntry[];
}

const socialFields: Array<{
  name: keyof SocialFormValues;
  label: string;
  placeholder: string;
}> = [
  { name: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/…' },
  { name: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/…' },
  { name: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/…' },
  { name: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/…' },
  { name: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/…' },
];

function toDayjs(value?: string) {
  return value ? dayjs(value) : undefined;
}

export default function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLocale();
  const { message } = AntdApp.useApp();
  const updateProfile = useUpdateProfile();
  const [form] = Form.useForm<ProfileFormValues>();

  if (!user) return null;

  const profile = user.profile ?? {};
  const social = profile.social ?? {};

  const initialValues: ProfileFormValues = {
    headline: profile.headline,
    location: profile.location,
    website: profile.website,
    github: profile.github,
    bio: profile.bio,
    skills: profile.skills ?? [],
    social: {
      youtube: social.youtube,
      twitter: social.twitter,
      facebook: social.facebook,
      linkedin: social.linkedin,
      instagram: social.instagram,
    },
    experience: (profile.experience ?? []).map((e) => ({
      ...e,
      from: toDayjs(e.from),
      to: toDayjs(e.to),
    })),
    education: (profile.education ?? []).map((e) => ({
      ...e,
      from: toDayjs(e.from),
      to: toDayjs(e.to),
    })),
  };

  const onFinish = async (values: ProfileFormValues) => {
    const payload: Partial<UserProfile> = {
      headline: values.headline?.trim() || undefined,
      location: values.location?.trim() || undefined,
      website: values.website?.trim() || undefined,
      github: values.github?.trim() || undefined,
      bio: values.bio?.trim() || undefined,
      skills: (values.skills ?? []).map((s) => s.trim()).filter(Boolean),
      social: {
        youtube: values.social?.youtube?.trim() || undefined,
        twitter: values.social?.twitter?.trim() || undefined,
        facebook: values.social?.facebook?.trim() || undefined,
        linkedin: values.social?.linkedin?.trim() || undefined,
        instagram: values.social?.instagram?.trim() || undefined,
      },
      experience: (values.experience ?? []).map((e) => ({
        // `from` is guaranteed by the form rules; cast for TS.
        title: e.title as string,
        company: e.company as string,
        location: e.location?.trim() || undefined,
        from: (e.from as dayjs.Dayjs).toISOString(),
        to: e.current ? undefined : e.to ? dayjs(e.to).toISOString() : undefined,
        current: !!e.current,
        description: e.description?.trim() || undefined,
      })),
      education: (values.education ?? []).map((e) => ({
        // `from` is guaranteed by the form rules; cast for TS.
        school: e.school as string,
        degree: e.degree as string,
        fieldofstudy: e.fieldofstudy as string,
        from: (e.from as dayjs.Dayjs).toISOString(),
        to: e.current ? undefined : e.to ? dayjs(e.to).toISOString() : undefined,
        current: !!e.current,
        description: e.description?.trim() || undefined,
      })),
    };

    try {
      await updateProfile.mutateAsync(payload);
      await refreshUser();
      message.success(t('dashboard.success'));
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <Title level={3}>{t('dashboard.title')}</Title>

      <Card style={{ marginBottom: 16 }}>
        <Space align="center" size={16}>
          <AvatarUpload size={96} />
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onFinish}
      >
        <Card title={t('dashboard.general')} style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }} size={0}>
            <Form.Item
              name="headline"
              label={t('dashboard.headline')}
              rules={[{ max: 140 }]}
            >
              <Input placeholder={t('dashboard.headlinePlaceholder')} />
            </Form.Item>

            <Space size={16} style={{ width: '100%' }} align="start">
              <Form.Item
                name="location"
                label={t('dashboard.location')}
                style={{ width: '50%' }}
              >
                <Input placeholder={t('dashboard.locationPlaceholder')} />
              </Form.Item>
              <Form.Item
                name="github"
                label={t('dashboard.github')}
                style={{ width: '50%' }}
              >
                <Input placeholder="Ex: saadouli" />
              </Form.Item>
            </Space>

            <Form.Item name="website" label={t('dashboard.website')}>
              <Input placeholder="https://…" />
            </Form.Item>

            <Form.Item name="bio" label={t('dashboard.bio')}>
              <Input.TextArea
                rows={5}
                maxLength={2000}
                showCount
                placeholder={t('dashboard.bioPlaceholder')}
              />
            </Form.Item>

            <Form.Item name="skills" label={t('dashboard.skills')}>
              <Select
                mode="tags"
                tokenSeparators={[',', ';']}
                placeholder={t('dashboard.skillsPlaceholder')}
              />
            </Form.Item>
          </Space>
        </Card>

        <Card title={t('dashboard.social')} style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }} size={0}>
            {socialFields.map(({ name, label, placeholder }) => (
              <Form.Item key={name} name={['social', name]} label={label}>
                <Input placeholder={placeholder} />
              </Form.Item>
            ))}
          </Space>
        </Card>

        <Card title={t('dashboard.experience')} style={{ marginBottom: 16 }}>
          <Form.List name="experience">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div
                    key={field.key}
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <Space
                      align="start"
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Text strong>
                        {t('dashboard.experienceItem', { index: field.name + 1 })}
                      </Text>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                          aria-label={t('dashboard.removePosition', {
                            index: field.name + 1,
                          })}
                        />
                      )}
                    </Space>

                    <Form.Item
                      name={[field.name, 'title']}
                      rules={[
                        { required: true, message: t('dashboard.positionTitleRequired') },
                      ]}
                    >
                      <Input placeholder={t('dashboard.positionTitle')} />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'company']}
                      rules={[
                        { required: true, message: t('dashboard.companyRequired') },
                      ]}
                    >
                      <Input placeholder={t('dashboard.company')} />
                    </Form.Item>
                    <Form.Item name={[field.name, 'location']}>
                      <Input placeholder={t('dashboard.positionLocation')} />
                    </Form.Item>

                    <Space size={16}>
                      <Form.Item
                        name={[field.name, 'from']}
                        label={t('dashboard.from')}
                        rules={[{ required: true, message: t('dashboard.fromRequired') }]}
                      >
                        <DatePicker picker="month" placeholder={t('dashboard.from')} />
                      </Form.Item>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) =>
                          prev.experience?.[field.name]?.current !==
                          cur.experience?.[field.name]?.current
                        }
                      >
                        {({ getFieldValue }) => {
                          const isCurrent = getFieldValue([
                            'experience',
                            field.name,
                            'current',
                          ]);
                          return (
                            <Form.Item
                              name={[field.name, 'to']}
                              label={t('dashboard.to')}
                              rules={
                                isCurrent
                                  ? []
                                  : [
                                      {
                                        required: true,
                                        message: t('dashboard.toRequired'),
                                      },
                                    ]
                              }
                            >
                              <DatePicker
                                picker="month"
                                placeholder={t('dashboard.to')}
                                disabled={!!isCurrent}
                              />
                            </Form.Item>
                          );
                        }}
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'current']}
                        valuePropName="checked"
                        label=" "
                      >
                        <Checkbox>{t('dashboard.current')}</Checkbox>
                      </Form.Item>
                    </Space>

                    <Form.Item name={[field.name, 'description']}>
                      <Input.TextArea
                        rows={2}
                        placeholder={t('dashboard.positionDescription')}
                      />
                    </Form.Item>
                  </div>
                ))}

                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  {t('dashboard.experienceAdd')}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title={t('dashboard.educationCard')} style={{ marginBottom: 16 }}>
          <Form.List name="education">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div
                    key={field.key}
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <Space
                      align="start"
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Text strong>
                        {t('dashboard.educationItem', { index: field.name + 1 })}
                      </Text>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                          aria-label={t('dashboard.removeDegree', {
                            index: field.name + 1,
                          })}
                        />
                      )}
                    </Space>

                    <Form.Item
                      name={[field.name, 'school']}
                      rules={[{ required: true, message: t('dashboard.schoolRequired') }]}
                    >
                      <Input placeholder={t('dashboard.school')} />
                    </Form.Item>
                    <Space size={16} style={{ width: '100%' }} align="start">
                      <Form.Item
                        name={[field.name, 'degree']}
                        rules={[
                          { required: true, message: t('dashboard.degreeRequired') },
                        ]}
                        style={{ width: '50%' }}
                      >
                        <Input placeholder={t('dashboard.degree')} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'fieldofstudy']}
                        rules={[
                          {
                            required: true,
                            message: t('dashboard.fieldofstudyRequired'),
                          },
                        ]}
                        style={{ width: '50%' }}
                      >
                        <Input placeholder={t('dashboard.fieldofstudy')} />
                      </Form.Item>
                    </Space>

                    <Space size={16}>
                      <Form.Item
                        name={[field.name, 'from']}
                        label={t('dashboard.from')}
                        rules={[{ required: true, message: t('dashboard.fromRequired') }]}
                      >
                        <DatePicker picker="month" placeholder={t('dashboard.from')} />
                      </Form.Item>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) =>
                          prev.education?.[field.name]?.current !==
                          cur.education?.[field.name]?.current
                        }
                      >
                        {({ getFieldValue }) => {
                          const isCurrent = getFieldValue([
                            'education',
                            field.name,
                            'current',
                          ]);
                          return (
                            <Form.Item
                              name={[field.name, 'to']}
                              label={t('dashboard.to')}
                              rules={
                                isCurrent
                                  ? []
                                  : [
                                      {
                                        required: true,
                                        message: t('dashboard.toRequired'),
                                      },
                                    ]
                              }
                            >
                              <DatePicker
                                picker="month"
                                placeholder={t('dashboard.to')}
                                disabled={!!isCurrent}
                              />
                            </Form.Item>
                          );
                        }}
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'current']}
                        valuePropName="checked"
                        label=" "
                      >
                        <Checkbox>{t('dashboard.currentStudy')}</Checkbox>
                      </Form.Item>
                    </Space>

                    <Form.Item name={[field.name, 'description']}>
                      <Input.TextArea
                        rows={2}
                        placeholder={t('dashboard.educationDescription')}
                      />
                    </Form.Item>
                  </div>
                ))}

                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  {t('dashboard.educationAdd')}
                </Button>
              </>
            )}
          </Form.List>
        </Card>

        <Space>
          <Button type="primary" htmlType="submit" loading={updateProfile.isPending}>
            {t('common.save')}
          </Button>
        </Space>
      </Form>
    </div>
  );
}
