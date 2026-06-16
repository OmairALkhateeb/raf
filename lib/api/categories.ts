import { Category, SubCategory, ProductFilter } from '@/types';
import { USE_MOCK } from './config';
import { apiFetch, mock } from './client';
import { categories, getCategoryBySlug, resolveCategoryNode } from '@/data/categories';
import { filtersBySubCategory, filtersByCategory, defaultFilters } from '@/data/filters';

/** GET /api/store/categories */
export function getCategories(): Promise<Category[]> {
  if (USE_MOCK) return mock(categories);
  return apiFetch<Category[]>('/categories');
}

/** GET /api/store/categories/{slug} */
export function getCategory(slug: string): Promise<Category | undefined> {
  if (USE_MOCK) return mock(getCategoryBySlug(slug));
  return apiFetch<Category>(`/categories/${slug}`);
}

/** Sub-categories of a category (mock convenience; API embeds these in the category). */
export function getSubCategories(categorySlug: string): Promise<SubCategory[]> {
  if (USE_MOCK) return mock(getCategoryBySlug(categorySlug)?.subCategories ?? []);
  return apiFetch<Category>(`/categories/${categorySlug}`).then(c => c.subCategories ?? []);
}

/**
 * GET /api/store/categories/{slug}/filters
 * `slug` may be a category OR a sub-category — filters are most specific at the
 * sub-category level, falling back to the category, then a generic set.
 */
export function getCategoryFilters(slug: string): Promise<ProductFilter[]> {
  if (USE_MOCK) {
    const { category, subCategory } = resolveCategoryNode(slug);
    const bySub = subCategory ? filtersBySubCategory[subCategory.slug] : undefined;
    const byCat = category ? filtersByCategory[category.slug] : undefined;
    return mock(bySub ?? byCat ?? defaultFilters);
  }
  return apiFetch<ProductFilter[]>(`/categories/${slug}/filters`);
}
