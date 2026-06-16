import { Banner, BannerPlacement, Product } from '@/types';
import { API_BASE, USE_MOCK } from './config';
import { apiFetch, mock } from './client';
import { getBannersByPlacement, getBannerById } from '@/data/banners';

export interface BannerQuery {
  categoryId?: string;
  brandId?: string;
}

/** GET /api/store/banners?placement=...[&category_id=...] */
export function getBanners(placement: BannerPlacement, params: BannerQuery = {}): Promise<Banner[]> {
  if (USE_MOCK) return mock(getBannersByPlacement(placement));
  const sp = new URLSearchParams({ placement });
  if (params.categoryId) sp.set('category_id', params.categoryId);
  if (params.brandId) sp.set('brand_id', params.brandId);
  return apiFetch<Banner[]>(`/banners?${sp.toString()}`);
}

/** GET /api/store/banners/{id} */
export function getBanner(id: string): Promise<Banner | undefined> {
  if (USE_MOCK) return mock(getBannerById(id));
  return apiFetch<Banner>(`/banners/${id}`);
}

/** GET /api/store/banners/{id}/products — products related to a banner. */
export function getBannerProducts(id: string): Promise<Product[]> {
  if (USE_MOCK) return mock([]); // backend-only; no mock dataset for this yet
  return apiFetch<Product[]>(`/banners/${id}/products`);
}

/**
 * POST /api/store/banners/{id}/click — best-effort click tracking.
 * Never throws and never blocks navigation; in mock mode it is a no-op.
 */
export async function trackBannerClick(id: string): Promise<void> {
  if (USE_MOCK || !API_BASE) return;
  try {
    await apiFetch<void>(`/banners/${id}/click`, { method: 'POST' });
  } catch {
    // swallow — tracking failures must never interrupt the user's navigation
  }
}
