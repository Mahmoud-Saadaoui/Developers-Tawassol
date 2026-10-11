const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface HttpError extends Error {
  status: number;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

/**
 * Thin fetch wrapper: JSON handling, credentials, a consistent error shape,
 * and a global 401 hook (session expired → `auth:unauthorized` event).
 *
 * Note: for `FormData` bodies we let the browser set the `Content-Type`
 * header so the multipart boundary is generated correctly.
 */
export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isForm = isFormData(options.body);

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: isForm
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Ignore the auth probes (`/auth/me`, `/auth/login`, …) so a visitor who
    // is simply not logged in doesn't trigger a spurious logout event.
    if (res.status === 401 && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    const error = new Error(
      data.message ?? `Request failed (${res.status})`,
    ) as HttpError;
    error.status = res.status;
    throw error;
  }

  return data as T;
}
