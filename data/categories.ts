import { Category, SubCategory } from '@/types';
import { flickr } from '@/utils/mockImage';

// NOTE: this is the temporary mock source. The real backend will serve the same
// shape from GET /api/store/categories. Sub-categories are navigation entities
// (selecting one shows ITS products) — they are not filters.

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'fragrances',
    name: 'Fragrances',
    nameAr: 'العطور',
    image: flickr('perfume,bottle', 'cat-fragrances', 600, 800),
    icon: '🌸',
    productCount: 45,
    featured: true,
    subCategories: [
      { id: 'sc-frag-women', slug: 'womens-fragrances', name: "Women's Fragrances", nameAr: 'عطور نسائية', categoryId: 'c1', productCount: 18 },
      { id: 'sc-frag-men', slug: 'mens-fragrances', name: "Men's Fragrances", nameAr: 'عطور رجالية', categoryId: 'c1', productCount: 15 },
      { id: 'sc-frag-oud', slug: 'oud-bukhoor', name: 'Oud & Bukhoor', nameAr: 'عود وبخور', categoryId: 'c1', productCount: 12 },
    ],
  },
  {
    id: 'c2',
    slug: 'fashion',
    name: 'Fashion',
    nameAr: 'الأزياء',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=85',
    icon: '👘',
    productCount: 62,
    featured: true,
    subCategories: [
      { id: 'sc-fash-women', slug: 'womens-fashion', name: "Women's Fashion", nameAr: 'أزياء نسائية', categoryId: 'c2', productCount: 28 },
      { id: 'sc-fash-men', slug: 'mens-fashion', name: "Men's Fashion", nameAr: 'أزياء رجالية', categoryId: 'c2', productCount: 20 },
      { id: 'sc-fash-acc', slug: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', categoryId: 'c2', productCount: 14 },
    ],
  },
  {
    id: 'c3',
    slug: 'home-living',
    name: 'Home & Living',
    nameAr: 'المنزل والمعيشة',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=800&fit=crop&q=85',
    icon: '🏠',
    productCount: 38,
    featured: true,
    subCategories: [
      { id: 'sc-home-decor', slug: 'home-decor', name: 'Home Decor', nameAr: 'ديكور المنزل', categoryId: 'c3', productCount: 22 },
      { id: 'sc-home-textiles', slug: 'textiles', name: 'Textiles', nameAr: 'مفروشات', categoryId: 'c3', productCount: 16 },
    ],
  },
  {
    id: 'c4',
    slug: 'food-gourmet',
    name: 'Food & Gourmet',
    nameAr: 'الأغذية والمأكولات الفاخرة',
    image: flickr('honey,dates', 'cat-food-gourmet', 600, 800),
    icon: '🍯',
    productCount: 54,
    featured: true,
    subCategories: [
      { id: 'sc-food-honey', slug: 'honey', name: 'Honey', nameAr: 'عسل', categoryId: 'c4', productCount: 18 },
      { id: 'sc-food-dates', slug: 'dates', name: 'Dates', nameAr: 'تمور', categoryId: 'c4', productCount: 20 },
      { id: 'sc-food-sweets', slug: 'sweets', name: 'Sweets', nameAr: 'حلويات', categoryId: 'c4', productCount: 16 },
    ],
  },
  {
    id: 'c5',
    slug: 'traditional-crafts',
    name: 'Traditional Crafts',
    nameAr: 'الحرف التقليدية',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=800&fit=crop&q=85',
    icon: '🗡️',
    productCount: 29,
    featured: true,
    subCategories: [
      { id: 'sc-craft-silver', slug: 'silver', name: 'Silverware', nameAr: 'فضيات', categoryId: 'c5', productCount: 14 },
      { id: 'sc-craft-pottery', slug: 'pottery', name: 'Pottery', nameAr: 'فخار', categoryId: 'c5', productCount: 15 },
    ],
  },
  {
    id: 'c6',
    slug: 'care',
    name: 'Care & Beauty',
    nameAr: 'العناية والجمال',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=800&fit=crop&q=85',
    icon: '✨',
    productCount: 41,
    featured: true,
    subCategories: [
      { id: 'sc-face-care', slug: 'face-care', name: 'Face Care', nameAr: 'عناية بالوجه', categoryId: 'c6', productCount: 18 },
      { id: 'sc-body-care', slug: 'body-care', name: 'Body Care', nameAr: 'عناية بالجسم', categoryId: 'c6', productCount: 13 },
      { id: 'sc-hair-care', slug: 'hair-care', name: 'Hair Care', nameAr: 'عناية بالشعر', categoryId: 'c6', productCount: 10 },
    ],
  },
];

/* ── Lookup helpers (reused by the mock service layer) ── */

export const allSubCategories: SubCategory[] = categories.flatMap(c => c.subCategories ?? []);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find(c => c.slug === slug || c.id === slug);

export const getSubCategoryBySlug = (slug: string): SubCategory | undefined =>
  allSubCategories.find(sc => sc.slug === slug || sc.id === slug);

/** Accepts a category OR sub-category slug/id and returns the matching entity kind. */
export const resolveCategoryNode = (slug: string): { category?: Category; subCategory?: SubCategory } => {
  const subCategory = getSubCategoryBySlug(slug);
  if (subCategory) {
    return { subCategory, category: categories.find(c => c.id === subCategory.categoryId) };
  }
  return { category: getCategoryBySlug(slug) };
};
