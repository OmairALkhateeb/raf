// Mock imagery that is RELEVANT to the content (keyword-based) and STABLE per
// seed — replaces the random picsum photos. Real photos from loremflickr by tag.
// When the real backend is connected it serves actual product/banner images and
// these helpers are no longer used.

const lock = (seed: string): number => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 100000;
};

/** Topic-relevant, deterministic image URL. `keywords` are comma-separated tags. */
export const flickr = (keywords: string, seed: string, w: number, h: number): string =>
  `https://loremflickr.com/${w}/${h}/${keywords}?lock=${lock(seed)}`;

/** Image search keywords for a product, by its category / sub-category. */
export const productImageKeywords = (categoryId: string, subCategoryId?: string): string => {
  switch (categoryId) {
    case 'c1': // Perfumes
      if (subCategoryId === 'sc-perf-oud') return 'oud,incense';
      if (subCategoryId === 'sc-perf-mist') return 'bodymist,spray';
      return 'perfume,bottle';
    case 'c2': // Makeup
      if (subCategoryId === 'sc-makeup-eyes') return 'eyeshadow,mascara';
      if (subCategoryId === 'sc-makeup-lips') return 'lipstick,lipgloss';
      if (subCategoryId === 'sc-makeup-brushes') return 'makeup,brush';
      return 'foundation,makeup';
    case 'c3': // Skincare
      if (subCategoryId === 'sc-skin-body') return 'lotion,bodycare';
      if (subCategoryId === 'sc-skin-sun') return 'sunscreen,suncare';
      return 'skincare,serum';
    case 'c4': // Lashes
      if (subCategoryId === 'sc-lash-serum') return 'lash,serum';
      return 'eyelashes,lashes';
    case 'c5': // Nails
      if (subCategoryId === 'sc-nail-care') return 'nail,care';
      if (subCategoryId === 'sc-nail-gel') return 'gel,nails';
      return 'nailpolish,manicure';
    case 'c6': // Beauty Devices
      if (subCategoryId === 'sc-dev-hair-removal') return 'epilator,device';
      if (subCategoryId === 'sc-dev-styling') return 'hairdryer,styling';
      return 'beauty,device';
    case 'c7': // Health & Nutrition
      if (subCategoryId === 'sc-health-protein') return 'protein,powder';
      if (subCategoryId === 'sc-health-snacks') return 'healthy,snack';
      if (subCategoryId === 'sc-health-supplements') return 'vitamins,supplements';
      if (subCategoryId === 'sc-health-wellness') return 'wellness,tea';
      return 'sugarfree,health';
    case 'c8': // Gifts & Giveaways
      if (subCategoryId === 'sc-gift-wedding') return 'wedding,giftbox';
      if (subCategoryId === 'sc-gift-ramadan') return 'ramadan,gift';
      if (subCategoryId === 'sc-gift-newborn') return 'baby,gift';
      return 'gift,box';
    default:
      return 'product';
  }
};
