import { Brand, Product } from '@/types';
import { USE_MOCK } from './config';
import { apiFetch, mock } from './client';
import { brands, getBrandBySlug } from '@/data/brands';
import { products, getProductsByBrand } from '@/data/products';

// Brand is an independent entity. It surfaces in the product filters UI, but its
// data always comes from here (or product.brand) — never treated as a generic
// dynamic filter value. Each brand also has its own mini-store page at
// /brands/{slug}, served by getBrand + getBrandProducts + getRelatedProducts.

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

/** GET /api/store/brands/{slug}/products — every product from one brand. */
export function getBrandProducts(slug: string): Promise<Product[]> {
  if (USE_MOCK) {
    const brand = getBrandBySlug(slug);
    return mock(brand ? getProductsByBrand(brand.id) : []);
  }
  return apiFetch<Product[]>(`/brands/${slug}/products`);
}

/**
 * GET /api/store/products?exclude_brand={slug}&limit={n}
 * Recommended products shown below a brand mini-store — favours the same
 * categories the brand sells in, then fills with a stable pseudo-random pick.
 */
export function getRelatedProducts(excludeBrandSlug: string, limit = 8): Promise<Product[]> {
  if (USE_MOCK) {
    const brand = getBrandBySlug(excludeBrandSlug);
    const brandCategories = new Set(
      products.filter(p => p.brandId === brand?.id).map(p => p.categoryId),
    );
    const others = products.filter(p => p.brandId !== brand?.id);
    // Same-category recommendations first, then everything else — stable order.
    const ranked = [...others].sort((a, b) => {
      const aw = brandCategories.has(a.categoryId) ? 0 : 1;
      const bw = brandCategories.has(b.categoryId) ? 0 : 1;
      if (aw !== bw) return aw - bw;
      return b.reviewCount - a.reviewCount;
    });
    return mock(ranked.slice(0, limit));
  }
  return apiFetch<Product[]>(`/products?exclude_brand=${excludeBrandSlug}&limit=${limit}`);
}
