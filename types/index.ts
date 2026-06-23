/** Dynamic attribute value carried by a product (drives dynamic filtering). */
export type AttributeValue = string | string[] | number | boolean;

export interface Product {
  id: string;
  /** URL-friendly identifier. Optional — routing still works by id. */
  slug?: string;
  name: string;
  nameAr: string;
  brand: string;
  brandAr: string;
  brandId: string;
  category: string;
  categoryAr: string;
  categoryId: string;
  /** Sub-category this product belongs to (navigation, not a filter). */
  subCategoryId?: string;
  /** Dynamic attributes (skin_type, hair_type, gender, size, usage, …). Source of dynamic filtering. */
  attributes?: Record<string, AttributeValue>;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  descriptionAr: string;
  specifications: Specification[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  discount?: number;
  colors?: string[];
  sizes?: string[];
}

export interface Specification {
  key: string;
  keyAr: string;
  value: string;
  valueAr: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
}

export interface Brand {
  id: string;
  /** URL-friendly identifier used in `/brands/{slug}` and `/products?brand={slug}`. */
  slug: string;
  name: string;
  nameAr: string;
  logo: string;
  /** Wide cover image shown on the brand mini-store page. */
  banner?: string;
  /** Short marketing line under the brand name. */
  tagline?: string;
  taglineAr?: string;
  description: string;
  descriptionAr: string;
  origin: string;
  featured: boolean;
  productCount: number;
  /** Optional brand accent colour for light theming on the mini-store. */
  accentColor?: string;
}

/** A sub-category belongs to a Category. Selecting one navigates to its products — it is NOT a filter. */
export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  categoryId: string;
  image?: string;
  productCount: number;
}

export interface Category {
  id: string;
  /** URL-friendly identifier used in `/products?category={slug}`. */
  slug: string;
  name: string;
  nameAr: string;
  image: string;
  icon: string;
  productCount: number;
  featured: boolean;
  subCategories?: SubCategory[];
}

/* ── Dynamic filters (delivered per sub-category by the backend) ── */

export type FilterType = 'select' | 'multi_select' | 'range' | 'boolean' | 'number';

export interface FilterValue {
  value: string;
  label: string;
  labelAr: string;
  count?: number;
}

export interface ProductFilter {
  /** Query-param key, e.g. `skin_type`. */
  key: string;
  label: string;
  labelAr: string;
  type: FilterType;
  /** Present for select / multi_select. */
  values?: FilterValue[];
  /** Present for range / number. */
  min?: number;
  max?: number;
  unit?: string;
}

/* ── Banners (admin-managed, clickable, route to related products) ── */

export type BannerPlacement =
  | 'home_hero'
  | 'home_middle'
  | 'home_bottom'
  | 'category_page'
  | 'brand_page';

export type BannerLinkType =
  | 'category'
  | 'brand'
  | 'product'
  | 'product_listing'
  | 'search'
  | 'custom_url';

export interface BannerTarget {
  categorySlug?: string;
  brandSlug?: string;
  productSlug?: string;
  /** For product_listing: filters compiled into query params. */
  filters?: Record<string, string | number>;
  /** For product_listing/custom_url: an explicit (relative) URL. */
  url?: string;
  /** For search. */
  searchQuery?: string;
}

export interface Banner {
  id: string;
  placement: BannerPlacement;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  buttonText: string;
  buttonTextAr: string;
  imageDesktop: string;
  imageMobile: string;
  linkType: BannerLinkType;
  target: BannerTarget;
  bgColor?: string;
  textColor?: string;
}

/* ── Product query contract (shared by mock + real API) ── */

export interface ProductQuery {
  category?: string;
  subCategory?: string;
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  search?: string;
  hasDiscount?: boolean;
  sort?: SortOption;
  /** Dynamic select / multi_select / boolean filters keyed by ProductFilter.key. */
  attributes?: Record<string, string[]>;
  /** Dynamic range / number filters keyed by ProductFilter.key (e.g. `size`). */
  ranges?: Record<string, { min?: number; max?: number }>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  total: number;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  governorate: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  orders: Order[];
}

export type Language = 'en' | 'ar';
export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
