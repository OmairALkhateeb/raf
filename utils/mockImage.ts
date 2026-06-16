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
    case 'c1': // Fragrances
      return subCategoryId === 'sc-frag-oud' ? 'oud,incense' : 'perfume,bottle';
    case 'c2': // Fashion
      return subCategoryId === 'sc-fash-acc' ? 'accessories,jewelry' : 'fashion,clothing';
    case 'c3': // Home & Living
      return subCategoryId === 'sc-home-textiles' ? 'textile,cushion' : 'home,decor';
    case 'c4': // Food & Gourmet
      if (subCategoryId === 'sc-food-honey') return 'honey,jar';
      if (subCategoryId === 'sc-food-dates') return 'dates,fruit';
      if (subCategoryId === 'sc-food-sweets') return 'arabic,sweets';
      return 'food,gourmet';
    case 'c5': // Traditional Crafts
      return subCategoryId === 'sc-craft-pottery' ? 'pottery,ceramic' : 'silver,handicraft';
    case 'c6': // Care & Beauty
      if (subCategoryId === 'sc-hair-care') return 'haircare,shampoo';
      if (subCategoryId === 'sc-body-care') return 'lotion,skincare';
      return 'skincare,cosmetics';
    default:
      return 'product';
  }
};
