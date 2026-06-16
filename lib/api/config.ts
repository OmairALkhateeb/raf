// Single switch that decides mock vs. real backend.
//
// While NEXT_PUBLIC_API_BASE_URL is unset we run entirely on mock data
// (data/*.ts). Set it (e.g. https://api.example.com) to bind the real REST
// backend — no UI changes required, the service layer flips automatically.

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

/** True when no API base URL is configured → serve mock data. */
export const USE_MOCK = API_BASE === '';

/** Mimic a little latency so loading states are exercised in mock mode. */
export const MOCK_LATENCY_MS = 250;
