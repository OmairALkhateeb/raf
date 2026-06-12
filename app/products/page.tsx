'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { Product, SortOption } from '@/types';
import { products } from '@/data/products';
import { brands } from '@/data/brands';
import { categories } from '@/data/categories';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

const PRICE_MAX = 200;

const pricePresets: { labelEn: string; labelAr: string; range: [number, number] }[] = [
  { labelEn: 'Under 10', labelAr: 'أقل من 10', range: [0, 10] },
  { labelEn: '10 – 50', labelAr: '10 – 50', range: [10, 50] },
  { labelEn: '50 – 100', labelAr: '50 – 100', range: [50, 100] },
  { labelEn: 'Over 100', labelAr: 'أكثر من 100', range: [100, PRICE_MAX] },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const { language, t, isRTL } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX]);

  // Filters are a core feature: keep the panel open by default on desktop,
  // collapse to a bottom sheet on mobile.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => {
      setIsDesktop(mq.matches);
      setIsFilterOpen(mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort') as SortOption;
    if (cat) setSelectedCategories([cat]);
    if (brand) setSelectedBrands([brand]);
    if (sort) setSortBy(sort);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const searchQuery = searchParams.get('search') || '';

  const filteredAndSorted = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(searchQuery) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(tg => tg.toLowerCase().includes(q))
      );
    }
    if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.categoryId));
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brandId));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'popular': default: result.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return result;
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy]);

  const toggleCategory = (id: string) =>
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const toggleBrand = (id: string) =>
    setSelectedBrands(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, PRICE_MAX]);
    setSortBy('popular');
  };

  const priceActive = priceRange[0] !== 0 || priceRange[1] !== PRICE_MAX;
  const activeFilters = selectedCategories.length + selectedBrands.length + (priceActive ? 1 : 0);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: t.filters.sortOptions.popular },
    { value: 'newest', label: t.filters.sortOptions.newest },
    { value: 'price-asc', label: t.filters.sortOptions.priceAsc },
    { value: 'price-desc', label: t.filters.sortOptions.priceDesc },
    { value: 'rating', label: t.filters.sortOptions.rating },
  ];

  const pageTitle = searchQuery
    ? `"${searchQuery}"`
    : selectedCategories.length === 1
    ? (categories.find(c => c.id === selectedCategories[0])
        ? language === 'ar'
          ? categories.find(c => c.id === selectedCategories[0])!.nameAr
          : categories.find(c => c.id === selectedCategories[0])!.name
        : t.nav.products)
    : t.nav.products;

  const isPresetActive = (range: [number, number]) =>
    priceRange[0] === range[0] && priceRange[1] === range[1];

  /* Shared filter panel content — rendered in the desktop sidebar
     and inside the mobile bottom sheet */
  const filterPanelContent = (
    <>
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/40 mb-4">
          {t.filters.categories}
        </h3>
        <div className="space-y-0 border-t border-[#2D1F1F]/8">
          {categories.map(cat => (
            <label
              key={cat.id}
              className="flex items-center justify-between py-2.5 border-b border-[#2D1F1F]/8 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? 'border-[#C9A84C] bg-[#C9A84C]'
                    : 'border-[#2D1F1F]/25 group-hover:border-[#C9A84C]'
                }`}>
                  {selectedCategories.includes(cat.id) && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-[#2D1F1F]/70 group-hover:text-[#2D1F1F] transition-colors">
                  {language === 'ar' ? cat.nameAr : cat.name}
                </span>
              </div>
              <span className="text-[10px] text-[#2D1F1F]/30">{cat.productCount}</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/40 mb-4">
          {t.filters.brands}
        </h3>
        <div className="space-y-0 border-t border-[#2D1F1F]/8">
          {brands.slice(0, 9).map(brand => (
            <label
              key={brand.id}
              className="flex items-center gap-3 py-2.5 border-b border-[#2D1F1F]/8 cursor-pointer group"
            >
              <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                selectedBrands.includes(brand.id)
                  ? 'border-[#C9A84C] bg-[#C9A84C]'
                  : 'border-[#2D1F1F]/25 group-hover:border-[#C9A84C]'
              }`}>
                {selectedBrands.includes(brand.id) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[13px] text-[#2D1F1F]/70 group-hover:text-[#2D1F1F] transition-colors">
                {language === 'ar' ? brand.nameAr : brand.name}
              </span>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                onChange={() => toggleBrand(brand.id)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/40 mb-4">
          {t.filters.priceRange}
        </h3>

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-2 mb-5">
          {pricePresets.map(preset => (
            <button
              key={preset.labelEn}
              onClick={() =>
                isPresetActive(preset.range)
                  ? setPriceRange([0, PRICE_MAX])
                  : setPriceRange(preset.range)
              }
              className={`h-8 px-3 text-[11px] font-bold tracking-wide transition-colors border ${
                isPresetActive(preset.range)
                  ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                  : 'border-[#2D1F1F]/20 text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#2D1F1F]'
              }`}
            >
              {language === 'ar' ? preset.labelAr : preset.labelEn}
            </button>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#C9A84C] mb-2"
        />
        <div className="flex justify-between text-[11px] text-[#2D1F1F]/50 font-medium">
          <span>OMR {priceRange[0]}</span>
          <span>OMR {priceRange[1]}</span>
        </div>
      </div>
    </>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} pt-10 sm:pt-14 pb-6`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Browse Our Selection' : 'تصفح مجموعتنا'}
          </span>
          <div className="flex items-end justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{pageTitle}</h1>
            {!isLoading && (
              <p className="text-[#2D1F1F]/40 text-sm pb-1">
                {filteredAndSorted.length} {t.filters.results}
              </p>
            )}
          </div>
        </div>

        {/* Category rail — always visible, the primary way to narrow results */}
        <div className={`${cx} pb-5`}>
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedCategories([])}
              className={`flex items-center gap-2 h-10 px-5 text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 border ${
                selectedCategories.length === 0
                  ? 'border-[#2D1F1F] bg-[#2D1F1F] text-white'
                  : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#2D1F1F]/40 hover:text-[#2D1F1F]'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.map(cat => {
              const active = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 h-10 px-5 text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-200 border ${
                    active
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-white shadow-gold'
                      : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#2D1F1F]'
                  }`}
                >
                  <span className="text-sm leading-none">{cat.icon}</span>
                  {language === 'ar' ? cat.nameAr : cat.name}
                  <span className={active ? 'text-white/70' : 'text-[#2D1F1F]/30'}>
                    {cat.productCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter & sort toolbar */}
      <div className="border-b border-[#2D1F1F]/8 bg-white sticky top-[68px] z-30">
        <div className={`${cx} h-14 flex items-center justify-between gap-4`}>
          {/* Left: filter toggle + active chips */}
          <div className={`flex items-center gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 h-9 px-4 border text-[11px] font-bold tracking-[0.12em] uppercase transition-colors flex-shrink-0 ${
                isFilterOpen
                  ? 'border-[#2D1F1F] bg-[#2D1F1F] text-white'
                  : 'border-[#2D1F1F]/20 text-[#2D1F1F]/70 hover:border-[#2D1F1F]/50'
              }`}
            >
              <SlidersHorizontal size={12} />
              {t.filters.filters}
              {activeFilters > 0 && (
                <span className="w-4 h-4 bg-[#C9A84C] text-white text-[9px] font-black flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Active filter chips */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {selectedCategories.map(id => {
                const cat = categories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12 transition-colors"
                  >
                    {language === 'ar' ? cat.nameAr : cat.name}
                    <X size={9} />
                  </button>
                );
              })}
              {selectedBrands.map(id => {
                const brand = brands.find(b => b.id === id);
                if (!brand) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleBrand(id)}
                    className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12 transition-colors"
                  >
                    {language === 'ar' ? brand.nameAr : brand.name}
                    <X size={9} />
                  </button>
                );
              })}
              {priceActive && (
                <button
                  onClick={() => setPriceRange([0, PRICE_MAX])}
                  className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12 transition-colors"
                >
                  OMR {priceRange[0]}–{priceRange[1]}
                  <X size={9} />
                </button>
              )}
              {activeFilters > 0 && (
                <button
                  onClick={clearAll}
                  className="h-7 px-3 text-[10px] font-bold tracking-wide uppercase text-[#C9A84C] hover:text-[#2D1F1F] transition-colors whitespace-nowrap"
                >
                  {t.filters.clearAll}
                </button>
              )}
            </div>
          </div>

          {/* Right: sort */}
          <div className="relative flex-shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="h-9 pl-3 pr-8 bg-transparent border border-[#2D1F1F]/20 text-[11px] font-bold tracking-[0.1em] uppercase appearance-none cursor-pointer hover:border-[#C9A84C] focus:outline-none focus:border-[#C9A84C] text-[#2D1F1F]"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={10} className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#2D1F1F]/50 ${isRTL ? 'left-2' : 'right-2'}`} />
          </div>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="flex gap-8 lg:gap-12">
          {/* Desktop sidebar filter panel */}
          {isDesktop && (
            <AnimatePresence>
              {isFilterOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 230, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <div className="w-[230px] sticky top-[130px]">
                    {filterPanelContent}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="py-28 text-center">
                <p className="text-4xl font-serif text-[#2D1F1F]/10 mb-6">—</p>
                <h3 className="text-xl font-serif text-[#2D1F1F] mb-3">
                  {language === 'en' ? 'No products found' : 'لا توجد منتجات'}
                </h3>
                <p className="text-[#2D1F1F]/45 text-sm mb-8">
                  {language === 'en' ? 'Try adjusting your filters' : 'حاول تعديل الفلاتر'}
                </p>
                <button
                  onClick={clearAll}
                  className="px-8 py-3 border border-[#2D1F1F] text-[11px] font-black tracking-[0.25em] uppercase text-[#2D1F1F] hover:bg-[#2D1F1F] hover:text-white transition-colors"
                >
                  {t.filters.clearAll}
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-x-5 gap-y-10 ${
                  isDesktop && isFilterOpen
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                }`}
              >
                {filteredAndSorted.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                  >
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      {!isDesktop && (
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl max-h-[82vh] flex flex-col"
              >
                {/* Sheet header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2D1F1F]/8 flex-shrink-0">
                  <h2 className="text-[13px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]">
                    {t.filters.filters}
                    {activeFilters > 0 && (
                      <span className="ml-2 text-[#C9A84C]">({activeFilters})</span>
                    )}
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F]"
                    aria-label="Close filters"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto px-6 py-6 flex-1">
                  {filterPanelContent}
                </div>

                {/* Apply bar */}
                <div className="flex gap-3 px-6 py-4 border-t border-[#2D1F1F]/8 flex-shrink-0 bg-white">
                  <button
                    onClick={clearAll}
                    className="h-12 px-5 border border-[#2D1F1F]/20 text-[11px] font-bold tracking-[0.15em] uppercase text-[#2D1F1F]/70"
                  >
                    {t.filters.clearAll}
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 h-12 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors"
                  >
                    {language === 'ar'
                      ? `عرض ${filteredAndSorted.length} منتج`
                      : `Show ${filteredAndSorted.length} results`}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="skeleton w-full" style={{ aspectRatio: '4/5' }} />
              <div className="pt-4 space-y-2">
                <div className="skeleton h-3 w-2/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
