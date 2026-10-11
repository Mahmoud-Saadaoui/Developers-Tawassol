import { http } from './http';

export const uploadApi = {
  avatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return http<{ avatar: { url: string; publicId: string } }>('/upload/avatar', {
      method: 'POST',
      body: formData,
    });
  },

  image: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return http<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
    });
  },
};
