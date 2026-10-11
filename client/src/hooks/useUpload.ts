import { useMutation } from '@tanstack/react-query';
import { uploadApi } from '../api/upload';

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.avatar(file),
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.image(file),
  });
}
