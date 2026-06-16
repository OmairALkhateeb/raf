import { ProductFilter, FilterValue } from '@/types';

// Temporary mock source for dynamic, per-sub-category filters.
// The real backend serves the same shape from
// GET /api/store/categories/{slug}/filters.
//
// IMPORTANT: Brand is NOT defined here — it is an independent entity that the
// UI renders as its own filter block (sourced from /brands). Sub-categories are
// navigation, never filters.

const PRICE_MAX = 200;

/* ── Canonical attribute value pools ──
   Shared with product augmentation so filter values always match product data. */
export const attributePools = {
  skin_type: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
  skin_concern: ['sensitive-skin', 'dark-spots', 'wrinkles', 'uneven-tone', 'acne', 'dryness'],
  product_function: ['hydration', 'cleansing', 'exfoliation', 'anti-aging', 'brightening'],
  product_type: ['cream', 'serum', 'cleanser', 'toner', 'mask', 'sunscreen'],
  spf: ['none', 'spf15', 'spf30', 'spf50'],
  usage: ['day', 'night', 'all-day'],
  gender: ['women', 'men', 'unisex'],
  concentration: ['edp', 'edt', 'parfum', 'oil'],
  fragrance_family: ['oriental', 'floral', 'woody', 'fresh', 'musky'],
  hair_type: ['straight', 'wavy', 'curly', 'coily'],
  hair_problem: ['dryness', 'dandruff', 'hair-loss', 'frizz'],
  hair_product_type: ['shampoo', 'conditioner', 'mask', 'oil', 'serum'],
} as const;

const v = (en: Record<string, string>, ar: Record<string, string>, keys: readonly string[]): FilterValue[] =>
  keys.map(k => ({ value: k, label: en[k] ?? k, labelAr: ar[k] ?? k }));

const skinTypeValues = v(
  { dry: 'Dry', oily: 'Oily', combination: 'Combination', sensitive: 'Sensitive', normal: 'Normal' },
  { dry: 'جافة', oily: 'دهنية', combination: 'مختلطة', sensitive: 'حساسة', normal: 'عادية' },
  attributePools.skin_type,
);
const usageValues = v(
  { day: 'Day', night: 'Night', 'all-day': 'All Day' },
  { day: 'نهاري', night: 'ليلي', 'all-day': 'طوال اليوم' },
  attributePools.usage,
);
const genderValues = v(
  { women: 'Women', men: 'Men', unisex: 'Unisex' },
  { women: 'نسائي', men: 'رجالي', unisex: 'للجنسين' },
  attributePools.gender,
);
const concentrationValues = v(
  { edp: 'Eau de Parfum', edt: 'Eau de Toilette', parfum: 'Parfum', oil: 'Perfume Oil' },
  { edp: 'أو دو بارفان', edt: 'أو دو تواليت', parfum: 'بارفان', oil: 'زيت عطري' },
  attributePools.concentration,
);
const hairTypeValues = v(
  { straight: 'Straight', wavy: 'Wavy', curly: 'Curly', coily: 'Coily' },
  { straight: 'ناعم', wavy: 'مموج', curly: 'مجعد', coily: 'شديد التجعد' },
  attributePools.hair_type,
);
const hairProblemValues = v(
  { dryness: 'Dryness', dandruff: 'Dandruff', 'hair-loss': 'Hair Loss', frizz: 'Frizz' },
  { dryness: 'جفاف', dandruff: 'قشرة', 'hair-loss': 'تساقط', frizz: 'تطاير' },
  attributePools.hair_problem,
);
const skinConcernValues = v(
  { 'sensitive-skin': 'Sensitive Skin', 'dark-spots': 'Dark Spots', wrinkles: 'Fine Lines & Wrinkles', 'uneven-tone': 'Uneven Tone', acne: 'Acne & Blemishes', dryness: 'Dryness' },
  { 'sensitive-skin': 'البشرة الحساسة', 'dark-spots': 'البقع الداكنة/التصبغات', wrinkles: 'الخطوط الدقيقة والتجاعيد', 'uneven-tone': 'تفاوت لون البشرة', acne: 'حب الشباب والعيوب', dryness: 'الجفاف' },
  attributePools.skin_concern,
);
const functionValues = v(
  { hydration: 'Hydration', cleansing: 'Cleansing', exfoliation: 'Exfoliation', 'anti-aging': 'Anti-aging', brightening: 'Brightening' },
  { hydration: 'ترطيب', cleansing: 'تنظيف', exfoliation: 'تقشير', 'anti-aging': 'مكافحة الشيخوخة', brightening: 'تفتيح' },
  attributePools.product_function,
);
const productTypeValues = v(
  { cream: 'Cream', serum: 'Serum', cleanser: 'Cleanser', toner: 'Toner', mask: 'Mask', sunscreen: 'Sunscreen' },
  { cream: 'كريم', serum: 'سيروم', cleanser: 'غسول', toner: 'تونر', mask: 'ماسك', sunscreen: 'واقٍ شمسي' },
  attributePools.product_type,
);
const spfValues = v(
  { none: 'None', spf15: 'SPF 15', spf30: 'SPF 30', spf50: 'SPF 50+' },
  { none: 'بدون', spf15: 'SPF 15', spf30: 'SPF 30', spf50: '+SPF 50' },
  attributePools.spf,
);
const familyValues = v(
  { oriental: 'Oriental', floral: 'Floral', woody: 'Woody', fresh: 'Fresh', musky: 'Musky' },
  { oriental: 'شرقي', floral: 'زهري', woody: 'خشبي', fresh: 'منعش', musky: 'مسكي' },
  attributePools.fragrance_family,
);
const hairProductTypeValues = v(
  { shampoo: 'Shampoo', conditioner: 'Conditioner', mask: 'Mask', oil: 'Oil', serum: 'Serum' },
  { shampoo: 'شامبو', conditioner: 'بلسم', mask: 'ماسك', oil: 'زيت', serum: 'سيروم' },
  attributePools.hair_product_type,
);
const ratingValues: FilterValue[] = [
  { value: '4', label: '4 ★ & up', labelAr: '4 ★ فأكثر' },
  { value: '3', label: '3 ★ & up', labelAr: '3 ★ فأكثر' },
  { value: '2', label: '2 ★ & up', labelAr: '2 ★ فأكثر' },
];

const priceFilter: ProductFilter = {
  key: 'price', label: 'Price', labelAr: 'السعر', type: 'range', min: 0, max: PRICE_MAX, unit: 'OMR',
};
const ratingFilter: ProductFilter = {
  key: 'rating', label: 'Rating', labelAr: 'التقييم', type: 'select', values: ratingValues,
};
const sizeFilter: ProductFilter = {
  key: 'size', label: 'Size', labelAr: 'الحجم', type: 'range', min: 30, max: 500, unit: 'ml',
};
const discountFilter: ProductFilter = {
  key: 'has_discount', label: 'On Offer', labelAr: 'عليه عرض', type: 'boolean',
};

const skinTypeFilter: ProductFilter = { key: 'skin_type', label: 'Skin Type', labelAr: 'نوع البشرة', type: 'multi_select', values: skinTypeValues };
const skinConcernFilter: ProductFilter = { key: 'skin_concern', label: 'Skin Concern', labelAr: 'حالة البشرة', type: 'multi_select', values: skinConcernValues };
const functionFilter: ProductFilter = { key: 'product_function', label: 'Product Function', labelAr: 'وظيفة المنتج', type: 'multi_select', values: functionValues };
const productTypeFilter: ProductFilter = { key: 'product_type', label: 'Product Type', labelAr: 'نوع المنتج', type: 'multi_select', values: productTypeValues };
const spfFilter: ProductFilter = { key: 'spf', label: 'Sun Protection', labelAr: 'عامل الحماية من الشمس', type: 'select', values: spfValues };
const usageFilter: ProductFilter = { key: 'usage', label: 'Usage', labelAr: 'الاستخدام', type: 'select', values: usageValues };
const genderFilter: ProductFilter = { key: 'gender', label: 'Gender', labelAr: 'الجنس', type: 'select', values: genderValues };
const concentrationFilter: ProductFilter = { key: 'concentration', label: 'Concentration', labelAr: 'التركيز', type: 'select', values: concentrationValues };
const familyFilter: ProductFilter = { key: 'fragrance_family', label: 'Scent Family', labelAr: 'عائلة العطر', type: 'multi_select', values: familyValues };
const hairTypeFilter: ProductFilter = { key: 'hair_type', label: 'Hair Type', labelAr: 'نوع الشعر', type: 'select', values: hairTypeValues };
const hairProblemFilter: ProductFilter = { key: 'hair_problem', label: 'Hair Concern', labelAr: 'مشكلة الشعر', type: 'multi_select', values: hairProblemValues };
const hairProductTypeFilter: ProductFilter = { key: 'product_type', label: 'Product Type', labelAr: 'نوع المنتج', type: 'multi_select', values: hairProductTypeValues };

/** Per-sub-category filter sets (by sub-category slug) — detailed, accordion-friendly. */
export const filtersBySubCategory: Record<string, ProductFilter[]> = {
  'face-care': [skinTypeFilter, skinConcernFilter, functionFilter, productTypeFilter, spfFilter, usageFilter, genderFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'body-care': [skinTypeFilter, functionFilter, productTypeFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'hair-care': [hairTypeFilter, hairProblemFilter, hairProductTypeFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'womens-fragrances': [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'mens-fragrances': [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'oud-bukhoor': [concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
};

/** Per-category fallback filter sets (by category slug). */
export const filtersByCategory: Record<string, ProductFilter[]> = {
  fragrances: [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  care: [skinTypeFilter, skinConcernFilter, functionFilter, productTypeFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
};

/** Generic fallback when nothing more specific is defined. */
export const defaultFilters: ProductFilter[] = [ratingFilter, priceFilter, discountFilter];
