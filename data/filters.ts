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
  // Skincare
  skin_type: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
  skin_concern: ['sensitive-skin', 'dark-spots', 'wrinkles', 'uneven-tone', 'acne', 'dryness'],
  product_function: ['hydration', 'cleansing', 'exfoliation', 'anti-aging', 'brightening'],
  product_type: ['cream', 'serum', 'cleanser', 'toner', 'mask', 'sunscreen'],
  spf: ['none', 'spf15', 'spf30', 'spf50'],
  usage: ['day', 'night', 'all-day'],
  // Perfumes
  gender: ['women', 'men', 'unisex'],
  concentration: ['edp', 'edt', 'parfum', 'oil', 'mist'],
  fragrance_family: ['oriental', 'floral', 'woody', 'fresh', 'musky'],
  // Makeup
  makeup_type: ['foundation', 'concealer', 'lipstick', 'lip-gloss', 'mascara', 'eyeshadow', 'eyeliner', 'blush', 'brush'],
  makeup_finish: ['matte', 'dewy', 'satin', 'shimmer'],
  // Lashes
  lash_style: ['natural', 'wispy', 'dramatic', 'volume'],
  lash_type: ['strip', 'individual', 'magnetic', 'serum'],
  // Nails
  nail_form: ['polish', 'gel', 'press-on', 'treatment'],
  nail_finish: ['glossy', 'matte', 'shimmer'],
  // Beauty devices
  device_type: ['hair-removal', 'facial', 'hair-styling', 'slimming'],
  device_tech: ['ipl', 'led', 'ultrasonic', 'ionic'],
  // Health & nutrition
  health_goal: ['muscle', 'weight-loss', 'energy', 'immunity', 'digestion'],
  dietary: ['sugar-free', 'vegan', 'gluten-free', 'keto', 'high-protein'],
  supplement_form: ['powder', 'capsule', 'bar', 'gummy', 'liquid'],
  // Gifts
  occasion: ['wedding', 'ramadan', 'eid', 'newborn', 'graduation', 'event'],
  recipient: ['her', 'him', 'kids', 'couple', 'baby'],
} as const;

const v = (en: Record<string, string>, ar: Record<string, string>, keys: readonly string[]): FilterValue[] =>
  keys.map(k => ({ value: k, label: en[k] ?? k, labelAr: ar[k] ?? k }));

/* ── Skincare ── */
const skinTypeValues = v(
  { dry: 'Dry', oily: 'Oily', combination: 'Combination', sensitive: 'Sensitive', normal: 'Normal' },
  { dry: 'جافة', oily: 'دهنية', combination: 'مختلطة', sensitive: 'حساسة', normal: 'عادية' },
  attributePools.skin_type,
);
const skinConcernValues = v(
  { 'sensitive-skin': 'Sensitive Skin', 'dark-spots': 'Dark Spots', wrinkles: 'Fine Lines & Wrinkles', 'uneven-tone': 'Uneven Tone', acne: 'Acne & Blemishes', dryness: 'Dryness' },
  { 'sensitive-skin': 'البشرة الحساسة', 'dark-spots': 'البقع الداكنة', wrinkles: 'الخطوط والتجاعيد', 'uneven-tone': 'تفاوت اللون', acne: 'حب الشباب', dryness: 'الجفاف' },
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
const usageValues = v(
  { day: 'Day', night: 'Night', 'all-day': 'All Day' },
  { day: 'نهاري', night: 'ليلي', 'all-day': 'طوال اليوم' },
  attributePools.usage,
);

/* ── Perfumes ── */
const genderValues = v(
  { women: 'Women', men: 'Men', unisex: 'Unisex' },
  { women: 'نسائي', men: 'رجالي', unisex: 'للجنسين' },
  attributePools.gender,
);
const concentrationValues = v(
  { edp: 'Eau de Parfum', edt: 'Eau de Toilette', parfum: 'Parfum', oil: 'Perfume Oil', mist: 'Body Mist' },
  { edp: 'أو دو بارفان', edt: 'أو دو تواليت', parfum: 'بارفان', oil: 'زيت عطري', mist: 'معطر جسم' },
  attributePools.concentration,
);
const familyValues = v(
  { oriental: 'Oriental', floral: 'Floral', woody: 'Woody', fresh: 'Fresh', musky: 'Musky' },
  { oriental: 'شرقي', floral: 'زهري', woody: 'خشبي', fresh: 'منعش', musky: 'مسكي' },
  attributePools.fragrance_family,
);

/* ── Makeup ── */
const makeupTypeValues = v(
  { foundation: 'Foundation', concealer: 'Concealer', lipstick: 'Lipstick', 'lip-gloss': 'Lip Gloss', mascara: 'Mascara', eyeshadow: 'Eyeshadow', eyeliner: 'Eyeliner', blush: 'Blush', brush: 'Brush' },
  { foundation: 'كريم أساس', concealer: 'خافي عيوب', lipstick: 'أحمر شفاه', 'lip-gloss': 'ملمع شفاه', mascara: 'ماسكارا', eyeshadow: 'ظلال عيون', eyeliner: 'محدد عيون', blush: 'أحمر خدود', brush: 'فرشاة' },
  attributePools.makeup_type,
);
const makeupFinishValues = v(
  { matte: 'Matte', dewy: 'Dewy', satin: 'Satin', shimmer: 'Shimmer' },
  { matte: 'مطفي', dewy: 'ندي', satin: 'ساتان', shimmer: 'لامع' },
  attributePools.makeup_finish,
);

/* ── Lashes ── */
const lashStyleValues = v(
  { natural: 'Natural', wispy: 'Wispy', dramatic: 'Dramatic', volume: 'Volume' },
  { natural: 'طبيعي', wispy: 'خفيف', dramatic: 'كثيف', volume: 'حجم إضافي' },
  attributePools.lash_style,
);
const lashTypeValues = v(
  { strip: 'Strip', individual: 'Individual', magnetic: 'Magnetic', serum: 'Serum' },
  { strip: 'كامل', individual: 'منفرد', magnetic: 'مغناطيسي', serum: 'سيروم' },
  attributePools.lash_type,
);

/* ── Nails ── */
const nailFormValues = v(
  { polish: 'Polish', gel: 'Gel', 'press-on': 'Press-on', treatment: 'Treatment' },
  { polish: 'طلاء', gel: 'جل', 'press-on': 'لاصق', treatment: 'علاج' },
  attributePools.nail_form,
);
const nailFinishValues = v(
  { glossy: 'Glossy', matte: 'Matte', shimmer: 'Shimmer' },
  { glossy: 'لامع', matte: 'مطفي', shimmer: 'متلألئ' },
  attributePools.nail_finish,
);

/* ── Beauty devices ── */
const deviceTypeValues = v(
  { 'hair-removal': 'Hair Removal', facial: 'Facial', 'hair-styling': 'Hair Styling', slimming: 'Slimming' },
  { 'hair-removal': 'إزالة الشعر', facial: 'العناية بالوجه', 'hair-styling': 'تصفيف الشعر', slimming: 'النحافة' },
  attributePools.device_type,
);
const deviceTechValues = v(
  { ipl: 'IPL', led: 'LED', ultrasonic: 'Ultrasonic', ionic: 'Ionic' },
  { ipl: 'IPL', led: 'LED', ultrasonic: 'موجات فوق صوتية', ionic: 'أيوني' },
  attributePools.device_tech,
);

/* ── Health & nutrition ── */
const healthGoalValues = v(
  { muscle: 'Muscle & Strength', 'weight-loss': 'Weight Management', energy: 'Energy', immunity: 'Immunity', digestion: 'Digestion' },
  { muscle: 'العضلات والقوة', 'weight-loss': 'إدارة الوزن', energy: 'الطاقة', immunity: 'المناعة', digestion: 'الهضم' },
  attributePools.health_goal,
);
const dietaryValues = v(
  { 'sugar-free': 'Sugar-Free', vegan: 'Vegan', 'gluten-free': 'Gluten-Free', keto: 'Keto', 'high-protein': 'High Protein' },
  { 'sugar-free': 'خالٍ من السكر', vegan: 'نباتي', 'gluten-free': 'خالٍ من الجلوتين', keto: 'كيتو', 'high-protein': 'عالي البروتين' },
  attributePools.dietary,
);
const supplementFormValues = v(
  { powder: 'Powder', capsule: 'Capsule', bar: 'Bar', gummy: 'Gummy', liquid: 'Liquid' },
  { powder: 'بودرة', capsule: 'كبسولات', bar: 'لوح', gummy: 'حلوى', liquid: 'سائل' },
  attributePools.supplement_form,
);

/* ── Gifts ── */
const occasionValues = v(
  { wedding: 'Wedding', ramadan: 'Ramadan', eid: 'Eid', newborn: 'Newborn', graduation: 'Graduation', event: 'Private Event' },
  { wedding: 'عرس', ramadan: 'رمضان', eid: 'عيد', newborn: 'مولود', graduation: 'تخرج', event: 'مناسبة خاصة' },
  attributePools.occasion,
);
const recipientValues = v(
  { her: 'For Her', him: 'For Him', kids: 'For Kids', couple: 'For Couples', baby: 'For Baby' },
  { her: 'لها', him: 'له', kids: 'للأطفال', couple: 'للأزواج', baby: 'للمولود' },
  attributePools.recipient,
);

const ratingValues: FilterValue[] = [
  { value: '4', label: '4 ★ & up', labelAr: '4 ★ فأكثر' },
  { value: '3', label: '3 ★ & up', labelAr: '3 ★ فأكثر' },
  { value: '2', label: '2 ★ & up', labelAr: '2 ★ فأكثر' },
];

/* ── Common filters ── */
const priceFilter: ProductFilter = { key: 'price', label: 'Price', labelAr: 'السعر', type: 'range', min: 0, max: PRICE_MAX, unit: 'OMR' };
const ratingFilter: ProductFilter = { key: 'rating', label: 'Rating', labelAr: 'التقييم', type: 'select', values: ratingValues };
const sizeFilter: ProductFilter = { key: 'size', label: 'Size', labelAr: 'الحجم', type: 'range', min: 10, max: 1000, unit: 'ml/g' };
const discountFilter: ProductFilter = { key: 'has_discount', label: 'On Offer', labelAr: 'عليه عرض', type: 'boolean' };

/* ── Skincare filters ── */
const skinTypeFilter: ProductFilter = { key: 'skin_type', label: 'Skin Type', labelAr: 'نوع البشرة', type: 'multi_select', values: skinTypeValues };
const skinConcernFilter: ProductFilter = { key: 'skin_concern', label: 'Skin Concern', labelAr: 'حالة البشرة', type: 'multi_select', values: skinConcernValues };
const functionFilter: ProductFilter = { key: 'product_function', label: 'Product Function', labelAr: 'وظيفة المنتج', type: 'multi_select', values: functionValues };
const productTypeFilter: ProductFilter = { key: 'product_type', label: 'Product Type', labelAr: 'نوع المنتج', type: 'multi_select', values: productTypeValues };
const spfFilter: ProductFilter = { key: 'spf', label: 'Sun Protection', labelAr: 'الحماية من الشمس', type: 'select', values: spfValues };
const usageFilter: ProductFilter = { key: 'usage', label: 'Usage', labelAr: 'الاستخدام', type: 'select', values: usageValues };

/* ── Perfume filters ── */
const genderFilter: ProductFilter = { key: 'gender', label: 'Gender', labelAr: 'الجنس', type: 'select', values: genderValues };
const concentrationFilter: ProductFilter = { key: 'concentration', label: 'Concentration', labelAr: 'التركيز', type: 'select', values: concentrationValues };
const familyFilter: ProductFilter = { key: 'fragrance_family', label: 'Scent Family', labelAr: 'عائلة العطر', type: 'multi_select', values: familyValues };

/* ── New-category filters ── */
const makeupTypeFilter: ProductFilter = { key: 'makeup_type', label: 'Product Type', labelAr: 'نوع المنتج', type: 'multi_select', values: makeupTypeValues };
const makeupFinishFilter: ProductFilter = { key: 'makeup_finish', label: 'Finish', labelAr: 'اللمسة النهائية', type: 'select', values: makeupFinishValues };
const lashStyleFilter: ProductFilter = { key: 'lash_style', label: 'Lash Style', labelAr: 'نمط الرموش', type: 'select', values: lashStyleValues };
const lashTypeFilter: ProductFilter = { key: 'lash_type', label: 'Lash Type', labelAr: 'نوع الرموش', type: 'select', values: lashTypeValues };
const nailFormFilter: ProductFilter = { key: 'nail_form', label: 'Type', labelAr: 'النوع', type: 'select', values: nailFormValues };
const nailFinishFilter: ProductFilter = { key: 'nail_finish', label: 'Finish', labelAr: 'اللمسة النهائية', type: 'select', values: nailFinishValues };
const deviceTypeFilter: ProductFilter = { key: 'device_type', label: 'Device Type', labelAr: 'نوع الجهاز', type: 'select', values: deviceTypeValues };
const deviceTechFilter: ProductFilter = { key: 'device_tech', label: 'Technology', labelAr: 'التقنية', type: 'select', values: deviceTechValues };
const healthGoalFilter: ProductFilter = { key: 'health_goal', label: 'Goal', labelAr: 'الهدف', type: 'multi_select', values: healthGoalValues };
const dietaryFilter: ProductFilter = { key: 'dietary', label: 'Dietary', labelAr: 'النظام الغذائي', type: 'multi_select', values: dietaryValues };
const supplementFormFilter: ProductFilter = { key: 'supplement_form', label: 'Form', labelAr: 'الشكل', type: 'select', values: supplementFormValues };
const occasionFilter: ProductFilter = { key: 'occasion', label: 'Occasion', labelAr: 'المناسبة', type: 'select', values: occasionValues };
const recipientFilter: ProductFilter = { key: 'recipient', label: 'Recipient', labelAr: 'المُهدى إليه', type: 'select', values: recipientValues };

/** Per-sub-category filter sets (by sub-category slug) — detailed, accordion-friendly. */
export const filtersBySubCategory: Record<string, ProductFilter[]> = {
  // Perfumes
  'womens-perfumes': [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'mens-perfumes': [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'oud-bukhoor': [concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'body-mists': [familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  // Makeup
  'face-makeup': [makeupTypeFilter, makeupFinishFilter, skinTypeFilter, ratingFilter, priceFilter, discountFilter],
  'eye-makeup': [makeupTypeFilter, makeupFinishFilter, ratingFilter, priceFilter, discountFilter],
  'lip-makeup': [makeupTypeFilter, makeupFinishFilter, ratingFilter, priceFilter, discountFilter],
  'makeup-brushes': [makeupTypeFilter, ratingFilter, priceFilter, discountFilter],
  // Skincare
  'face-care': [skinTypeFilter, skinConcernFilter, functionFilter, productTypeFilter, spfFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'body-care': [skinTypeFilter, functionFilter, productTypeFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'sun-care': [skinTypeFilter, spfFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  // Lashes
  'strip-lashes': [lashStyleFilter, lashTypeFilter, ratingFilter, priceFilter, discountFilter],
  'individual-lashes': [lashStyleFilter, lashTypeFilter, ratingFilter, priceFilter, discountFilter],
  'lash-serums': [lashTypeFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  // Nails
  'nail-polish': [nailFormFilter, nailFinishFilter, ratingFilter, priceFilter, discountFilter],
  'gel-nails': [nailFormFilter, nailFinishFilter, ratingFilter, priceFilter, discountFilter],
  'nail-care': [nailFormFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  // Beauty devices
  'hair-removal': [deviceTypeFilter, deviceTechFilter, ratingFilter, priceFilter, discountFilter],
  'facial-devices': [deviceTypeFilter, deviceTechFilter, ratingFilter, priceFilter, discountFilter],
  'hair-styling': [deviceTypeFilter, deviceTechFilter, ratingFilter, priceFilter, discountFilter],
  // Health & nutrition
  proteins: [healthGoalFilter, dietaryFilter, supplementFormFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  'sugar-free': [healthGoalFilter, dietaryFilter, supplementFormFilter, ratingFilter, priceFilter, discountFilter],
  'healthy-snacks': [dietaryFilter, healthGoalFilter, ratingFilter, priceFilter, discountFilter],
  supplements: [healthGoalFilter, supplementFormFilter, dietaryFilter, ratingFilter, priceFilter, discountFilter],
  wellness: [healthGoalFilter, dietaryFilter, ratingFilter, priceFilter, discountFilter],
  // Gifts
  weddings: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
  ramadan: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
  eid: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
  newborns: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
  graduations: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
  'private-events': [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
};

/** Per-category fallback filter sets (by category slug). */
export const filtersByCategory: Record<string, ProductFilter[]> = {
  perfumes: [genderFilter, concentrationFilter, familyFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  makeup: [makeupTypeFilter, makeupFinishFilter, ratingFilter, priceFilter, discountFilter],
  skincare: [skinTypeFilter, skinConcernFilter, functionFilter, productTypeFilter, usageFilter, sizeFilter, ratingFilter, priceFilter, discountFilter],
  lashes: [lashStyleFilter, lashTypeFilter, ratingFilter, priceFilter, discountFilter],
  nails: [nailFormFilter, nailFinishFilter, ratingFilter, priceFilter, discountFilter],
  'beauty-devices': [deviceTypeFilter, deviceTechFilter, ratingFilter, priceFilter, discountFilter],
  'health-nutrition': [healthGoalFilter, dietaryFilter, supplementFormFilter, ratingFilter, priceFilter, discountFilter],
  gifts: [occasionFilter, recipientFilter, ratingFilter, priceFilter, discountFilter],
};

/** Generic fallback when nothing more specific is defined. */
export const defaultFilters: ProductFilter[] = [ratingFilter, priceFilter, discountFilter];
