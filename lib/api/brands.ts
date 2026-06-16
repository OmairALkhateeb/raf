import { Brand } from '@/types';
import { USE_MOCK } from './config';
import { apiFetch, mock } from './client';
import { brands, getBrandBySlug } from '@/data/brands';

// Brand is an independent entity. It surfaces in the product filters UI, but its
// data always comes from here (or product.brand) — never treated as a generic
// dynamic filter value.

/** GET /api/store/brands */
export function getBrands(): Promise<Brand[]> {
  if (USE_MOCK) return mock(brands);
  return apiFetch<Brand[]>('/brands');
}

/** GET /api/store/brands/{slug} */
export function getBrand(slug: string): Promise<Brand | undefined> {
  if (USE_MOCK) return mock(getBrandBySlug(slug));
  return apiFetch<Brand>(`/brands/${slug}`);
}
