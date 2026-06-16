import { API_BASE, MOCK_LATENCY_MS } from './config';

/** Resolve a mock value as a Promise with a touch of latency. */
export function mock<T>(value: T): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

/**
 * Thin fetch wrapper for the real backend. All endpoints are namespaced under
 * `/api/store` (see the spec). Used only when API_BASE is set.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}/api/store${path}`, {
    headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json() as Promise<T>;
}

/** Build a query string from a flat params object, skipping empty values. */
export function toQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}
