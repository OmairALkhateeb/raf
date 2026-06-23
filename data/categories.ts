import { Category, SubCategory } from '@/types';
import { flickr } from '@/utils/mockImage';

// NOTE: this is the temporary mock source. The real backend will serve the same
// shape from GET /api/store/categories. Sub-categories are navigation entities
// (selecting one shows ITS products) — they are not filters.
//
// Commercial direction: beauty, lifestyle, gifts & wellness for Oman.
// Perfumes & skincare are kept (premium anchor); makeup, lashes, nails, beauty
// devices, health & nutrition and gifts lead the new catalogue.

export const categories: Category[] = [
  {
    id: 'c1',
    slug: 'perfumes',
    name: 'Perfumes',
    nameAr: 'العطور',
    image: flickr('perfume,bottle', 'cat-perfumes', 600, 800),
    icon: '🌸',
    productCount: 48,
    featured: true,
    subCategories: [
      { id: 'sc-perf-women', slug: 'womens-perfumes', name: "Women's Perfumes", nameAr: 'عطور نسائية', categoryId: 'c1', productCount: 20 },
      { id: 'sc-perf-men', slug: 'mens-perfumes', name: "Men's Perfumes", nameAr: 'عطور رجالية', categoryId: 'c1', productCount: 16 },
      { id: 'sc-perf-oud', slug: 'oud-bukhoor', name: 'Oud & Bukhoor', nameAr: 'عود وبخور', categoryId: 'c1', productCount: 12 },
      { id: 'sc-perf-mist', slug: 'body-mists', name: 'Body Mists', nameAr: 'معطرات الجسم', categoryId: 'c1', productCount: 10 },
    ],
  },
  {
    id: 'c2',
    slug: 'makeup',
    name: 'Makeup',
    nameAr: 'المكياج',
    image: flickr('makeup,cosmetics', 'cat-makeup', 600, 800),
    icon: '💄',
    productCount: 56,
    featured: true,
    subCategories: [
      { id: 'sc-makeup-face', slug: 'face-makeup', name: 'Face', nameAr: 'الوجه', categoryId: 'c2', productCount: 22 },
      { id: 'sc-makeup-eyes', slug: 'eye-makeup', name: 'Eyes', nameAr: 'العيون', categoryId: 'c2', productCount: 18 },
      { id: 'sc-makeup-lips', slug: 'lip-makeup', name: 'Lips', nameAr: 'الشفاه', categoryId: 'c2', productCount: 16 },
      { id: 'sc-makeup-brushes', slug: 'makeup-brushes', name: 'Brushes & Tools', nameAr: 'الفرش والأدوات', categoryId: 'c2', productCount: 9 },
    ],
  },
  {
    id: 'c3',
    slug: 'skincare',
    name: 'Skincare',
    nameAr: 'العناية بالبشرة',
    image: flickr('skincare,serum', 'cat-skincare', 600, 800),
    icon: '✨',
    productCount: 44,
    featured: true,
    subCategories: [
      { id: 'sc-skin-face', slug: 'face-care', name: 'Face Care', nameAr: 'العناية بالوجه', categoryId: 'c3', productCount: 20 },
      { id: 'sc-skin-body', slug: 'body-care', name: 'Body Care', nameAr: 'العناية بالجسم', categoryId: 'c3', productCount: 14 },
      { id: 'sc-skin-sun', slug: 'sun-care', name: 'Sun Care', nameAr: 'الحماية من الشمس', categoryId: 'c3', productCount: 10 },
    ],
  },
  {
    id: 'c4',
    slug: 'lashes',
    name: 'Lashes',
    nameAr: 'الرموش',
    image: flickr('eyelashes,beauty', 'cat-lashes', 600, 800),
    icon: '👁️',
    productCount: 28,
    featured: true,
    subCategories: [
      { id: 'sc-lash-strip', slug: 'strip-lashes', name: 'Strip Lashes', nameAr: 'رموش كاملة', categoryId: 'c4', productCount: 12 },
      { id: 'sc-lash-individual', slug: 'individual-lashes', name: 'Individual Lashes', nameAr: 'رموش منفردة', categoryId: 'c4', productCount: 8 },
      { id: 'sc-lash-serum', slug: 'lash-serums', name: 'Lash Serums', nameAr: 'سيرومات الرموش', categoryId: 'c4', productCount: 8 },
    ],
  },
  {
    id: 'c5',
    slug: 'nails',
    name: 'Nails',
    nameAr: 'الأظافر',
    image: flickr('nails,manicure', 'cat-nails', 600, 800),
    icon: '💅',
    productCount: 32,
    featured: true,
    subCategories: [
      { id: 'sc-nail-polish', slug: 'nail-polish', name: 'Nail Polish', nameAr: 'طلاء الأظافر', categoryId: 'c5', productCount: 14 },
      { id: 'sc-nail-gel', slug: 'gel-nails', name: 'Gel & Press-on', nameAr: 'جل ولاصق', categoryId: 'c5', productCount: 10 },
      { id: 'sc-nail-care', slug: 'nail-care', name: 'Nail Care', nameAr: 'العناية بالأظافر', categoryId: 'c5', productCount: 8 },
    ],
  },
  {
    id: 'c6',
    slug: 'beauty-devices',
    name: 'Beauty Devices',
    nameAr: 'أجهزة التجميل',
    image: flickr('beauty,device', 'cat-devices', 600, 800),
    icon: '💎',
    productCount: 22,
    featured: true,
    subCategories: [
      { id: 'sc-dev-hair-removal', slug: 'hair-removal', name: 'Hair Removal', nameAr: 'إزالة الشعر', categoryId: 'c6', productCount: 9 },
      { id: 'sc-dev-facial', slug: 'facial-devices', name: 'Facial Devices', nameAr: 'أجهزة الوجه', categoryId: 'c6', productCount: 8 },
      { id: 'sc-dev-styling', slug: 'hair-styling', name: 'Hair Styling', nameAr: 'تصفيف الشعر', categoryId: 'c6', productCount: 5 },
    ],
  },
  {
    id: 'c7',
    slug: 'health-nutrition',
    name: 'Health & Nutrition',
    nameAr: 'الصحة والتغذية',
    image: flickr('protein,supplements', 'cat-health', 600, 800),
    icon: '🌿',
    productCount: 50,
    featured: true,
    subCategories: [
      { id: 'sc-health-protein', slug: 'proteins', name: 'Proteins', nameAr: 'البروتينات', categoryId: 'c7', productCount: 14 },
      { id: 'sc-health-sugarfree', slug: 'sugar-free', name: 'Sugar-Free', nameAr: 'خالٍ من السكر', categoryId: 'c7', productCount: 12 },
      { id: 'sc-health-snacks', slug: 'healthy-snacks', name: 'Healthy Snacks', nameAr: 'وجبات صحية', categoryId: 'c7', productCount: 12 },
      { id: 'sc-health-supplements', slug: 'supplements', name: 'Supplements', nameAr: 'المكملات', categoryId: 'c7', productCount: 12 },
      { id: 'sc-health-wellness', slug: 'wellness', name: 'Wellness', nameAr: 'العافية', categoryId: 'c7', productCount: 10 },
    ],
  },
  {
    id: 'c8',
    slug: 'gifts',
    name: 'Gifts & Giveaways',
    nameAr: 'الهدايا والتوزيعات',
    image: flickr('gift,box', 'cat-gifts', 600, 800),
    icon: '🎁',
    featured: true,
    productCount: 30,
    subCategories: [
      { id: 'sc-gift-wedding', slug: 'weddings', name: 'Weddings', nameAr: 'الأعراس', categoryId: 'c8', productCount: 8 },
      { id: 'sc-gift-ramadan', slug: 'ramadan', name: 'Ramadan', nameAr: 'رمضان', categoryId: 'c8', productCount: 7 },
      { id: 'sc-gift-eid', slug: 'eid', name: 'Eid', nameAr: 'العيد', categoryId: 'c8', productCount: 6 },
      { id: 'sc-gift-newborn', slug: 'newborns', name: 'Newborns', nameAr: 'المواليد', categoryId: 'c8', productCount: 5 },
      { id: 'sc-gift-graduation', slug: 'graduations', name: 'Graduations', nameAr: 'التخرج', categoryId: 'c8', productCount: 5 },
      { id: 'sc-gift-events', slug: 'private-events', name: 'Private Events', nameAr: 'المناسبات الخاصة', categoryId: 'c8', productCount: 6 },
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
