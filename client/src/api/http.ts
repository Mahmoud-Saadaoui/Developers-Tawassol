const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/**
 * Thin fetch wrapper: JSON handling, credentials, and a consistent error shape.
 */
export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message ?? `Request failed (${res.status})`);
  }

  return data as T;
}
