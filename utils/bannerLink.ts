import { Banner } from '@/types';

/**
 * Resolve a banner's click target into an internal (relative) route.
 * Banners are never dead images — every one routes to related content.
 *
 * Pair with `trackBannerClick(banner.id)` in the component's onClick (fire and
 * forget) so click tracking never blocks navigation.
 */

/** Only allow safe, same-origin relative paths from admin-supplied URLs. */
function safeInternalUrl(url: string | undefined, fallback = '/'): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  // Reject protocol-relative (//evil) and absolute external / dangerous schemes.
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  return fallback;
}

function filtersToQuery(filters: Record<string, string | number> | undefined): string {
  if (!filters) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) sp.set(k, String(v));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export function bannerHref(banner: Banner): string {
  const t = banner.target ?? {};
  switch (banner.linkType) {
    case 'category':
      return t.categorySlug ? `/products?category=${encodeURIComponent(t.categorySlug)}` : '/products';
    case 'brand':
      return t.brandSlug ? `/products?brand=${encodeURIComponent(t.brandSlug)}` : '/products';
    case 'product':
      return t.productSlug ? `/products/${encodeURIComponent(t.productSlug)}` : '/products';
    case 'product_listing':
      if (t.url) return safeInternalUrl(t.url, '/products');
      return `/products${filtersToQuery(t.filters)}`;
    case 'search':
      return t.searchQuery ? `/products?search=${encodeURIComponent(t.searchQuery)}` : '/products';
    case 'custom_url':
      return safeInternalUrl(t.url, '/');
    default:
      return '/';
  }
}
