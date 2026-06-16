import { Product, ProductQuery, AttributeValue } from '@/types';
import { USE_MOCK } from './config';
import { apiFetch, mock } from './client';
import { products, getProductBySlug } from '@/data/products';
import { resolveCategoryNode } from '@/data/categories';
import { getBrandBySlug } from '@/data/brands';

/** True when a product's attribute matches any of the selected string values. */
function attributeMatches(value: AttributeValue | undefined, selected: string[]): boolean {
  if (value === undefined || selected.length === 0) return selected.length === 0;
  if (Array.isArray(value)) return value.some(v => selected.includes(String(v)));
  return selected.includes(String(value));
}

/** Apply a ProductQuery to the in-memory catalog (mock equivalent of the API). */
function filterMock(query: ProductQuery): Product[] {
  let result = [...products];

  // Category (slug or id)
  if (query.category) {
    const { category } = resolveCategoryNode(query.category);
    if (category) result = result.filter(p => p.categoryId === category.id);
  }
  // Sub-category (slug or id) — navigation, narrows to its products
  if (query.subCategory) {
    const { subCategory } = resolveCategoryNode(query.subCategory);
    if (subCategory) result = result.filter(p => p.subCategoryId === subCategory.id);
  }
  // Brands (independent entity; slugs or ids)
  if (query.brands && query.brands.length > 0) {
    const ids = new Set(query.brands.map(b => getBrandBySlug(b)?.id ?? b));
    result = result.filter(p => ids.has(p.brandId));
  }
  // Price range
  if (typeof query.priceMin === 'number') result = result.filter(p => p.price >= query.priceMin!);
  if (typeof query.priceMax === 'number') result = result.filter(p => p.price <= query.priceMax!);
  // Rating
  if (typeof query.rating === 'number') result = result.filter(p => p.rating >= query.rating!);
  // On offer
  if (query.hasDiscount) result = result.filter(p => !!p.discount && p.discount > 0);
  // Free-text search
  if (query.search) {
    const q = query.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.nameAr.includes(query.search!) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)),
    );
  }
  // Dynamic select / multi_select / boolean attributes
  if (query.attributes) {
    for (const [key, selected] of Object.entries(query.attributes)) {
      if (!selected || selected.length === 0) continue;
      result = result.filter(p => attributeMatches(p.attributes?.[key], selected));
    }
  }
  // Dynamic range / number attributes (e.g. size)
  if (query.ranges) {
    for (const [key, { min, max }] of Object.entries(query.ranges)) {
      result = result.filter(p => {
        const raw = p.attributes?.[key];
        const n = typeof raw === 'number' ? raw : Number(raw);
        if (Number.isNaN(n)) return false;
        if (typeof min === 'number' && n < min) return false;
        if (typeof max === 'number' && n > max) return false;
        return true;
      });
    }
  }

  // Sort
  switch (query.sort) {
    case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    case 'price-asc': result.sort((a, b) => a.price - b.price); break;
    case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating': result.sort((a, b) => b.rating - a.rating); break;
    case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    default: break;
  }
  return result;
}

/** Serialise a ProductQuery to the canonical query string used by the real API. */
export function queryToParams(query: ProductQuery): URLSearchParams {
  const sp = new URLSearchParams();
  if (query.category) sp.set('category', query.category);
  if (query.subCategory) sp.set('subCategory', query.subCategory);
  if (query.brands?.length) sp.set('brand', query.brands.join(','));
  if (typeof query.priceMin === 'number') sp.set('price_min', String(query.priceMin));
  if (typeof query.priceMax === 'number') sp.set('price_max', String(query.priceMax));
  if (typeof query.rating === 'number') sp.set('rating', String(query.rating));
  if (query.hasDiscount) sp.set('has_discount', '1');
  if (query.search) sp.set('search', query.search);
  if (query.sort) sp.set('sort', query.sort);
  if (query.attributes) {
    for (const [k, v] of Object.entries(query.attributes)) if (v?.length) sp.set(k, v.join(','));
  }
  if (query.ranges) {
    for (const [k, { min, max }] of Object.entries(query.ranges)) {
      if (typeof min === 'number') sp.set(`${k}_min`, String(min));
      if (typeof max === 'number') sp.set(`${k}_max`, String(max));
    }
  }
  return sp;
}

/** GET /api/store/products?... */
export function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  if (USE_MOCK) return mock(filterMock(query));
  return apiFetch<Product[]>(`/products?${queryToParams(query).toString()}`);
}

/** GET /api/store/products/{slug} */
export function getProduct(slugOrId: string): Promise<Product | undefined> {
  if (USE_MOCK) return mock(getProductBySlug(slugOrId));
  return apiFetch<Product>(`/products/${slugOrId}`);
}
