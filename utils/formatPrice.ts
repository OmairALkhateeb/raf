export const formatPrice = (price: number, currency = 'OMR', lang = 'en'): string => {
  if (lang === 'ar') {
    return `${price.toFixed(3)} ر.ع.`;
  }
  return `OMR ${price.toFixed(3)}`;
};

export const formatDiscount = (original: number, sale: number): number => {
  return Math.round(((original - sale) / original) * 100);
};
