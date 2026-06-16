'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, X, ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import BannerSection from '@/components/home/BannerSection';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { Product, SortOption, ProductFilter, Category, Brand, Banner, ProductQuery } from '@/types';
import { getProducts } from '@/lib/api/products';
import { getCategories, getCategoryFilters } from '@/lib/api/categories';
import { getBrands } from '@/lib/api/brands';
import { getBanners } from '@/lib/api/banners';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';
const PRICE_MAX = 200;

// Params that have a dedicated meaning; everything else in the URL is a dynamic
// select/multi_select attribute (`key=v1,v2`) or a range (`key_min`/`key_max`).
const RESERVED = new Set([
  'category', 'subCategory', 'brand', 'price_min', 'price_max', 'rating', 'has_discount', 'sort', 'search',
]);

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t, isRTL } = useLanguage();

  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cats, setCats] = useState<Category[]>([]);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const [filters, setFilters] = useState<ProductFilter[]>([]);
  const [catBanners, setCatBanners] = useState<Banner[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['brand']));
  const [groupSearch, setGroupSearch] = useState<Record<string, string>>({});

  /* ── URL is the single source of truth → derive the query from it ── */
  const query: ProductQuery = useMemo(() => {
    const attributes: Record<string, string[]> = {};
    const ranges: Record<string, { min?: number; max?: number }> = {};
    searchParams.forEach((value, key) => {
      if (RESERVED.has(key)) return;
      if (key.endsWith('_min') || key.endsWith('_max')) {
        const base = key.slice(0, -4);
        const n = Number(value);
        if (!Number.isNaN(n)) {
          ranges[base] = ranges[base] ?? {};
          if (key.endsWith('_min')) ranges[base].min = n; else ranges[base].max = n;
        }
        return;
      }
      attributes[key] = value.split(',').filter(Boolean);
    });
    const num = (k: string) => {
      const v = searchParams.get(k);
      return v !== null && v !== '' ? Number(v) : undefined;
    };
    return {
      category: searchParams.get('category') ?? undefined,
      subCategory: searchParams.get('subCategory') ?? undefined,
      brands: searchParams.get('brand')?.split(',').filter(Boolean),
      priceMin: num('price_min'),
      priceMax: num('price_max'),
      rating: num('rating'),
      hasDiscount: searchParams.get('has_discount') === '1',
      search: searchParams.get('search') ?? undefined,
      sort: (searchParams.get('sort') as SortOption) || undefined,
      attributes,
      ranges,
    };
  }, [searchParams]);

  /* ── URL writers ── */
  const setParams = useCallback((mut: (sp: URLSearchParams) => void) => {
    const sp = new URLSearchParams(searchParams.toString());
    mut(sp);
    router.replace(`/products?${sp.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Clears every dynamic filter param (keeps category context, brand, search, sort).
  const clearDynamic = (sp: URLSearchParams) => {
    Array.from(sp.keys()).forEach(k => { if (!RESERVED.has(k)) sp.delete(k); });
    ['price_min', 'price_max', 'rating', 'has_discount'].forEach(k => sp.delete(k));
  };

  const switchCategory = (slug?: string) => setParams(sp => {
    clearDynamic(sp);
    sp.delete('subCategory');
    if (slug) sp.set('category', slug); else sp.delete('category');
  });

  const switchSubCategory = (slug: string) => setParams(sp => {
    clearDynamic(sp); // filters change with the sub-category
    if (sp.get('subCategory') === slug) sp.delete('subCategory');
    else sp.set('subCategory', slug);
  });

  const toggleBrand = (slug: string) => setParams(sp => {
    const cur = (sp.get('brand')?.split(',').filter(Boolean)) ?? [];
    const next = cur.includes(slug) ? cur.filter(b => b !== slug) : [...cur, slug];
    if (next.length) sp.set('brand', next.join(',')); else sp.delete('brand');
  });

  const toggleMulti = (key: string, value: string) => setParams(sp => {
    const cur = (sp.get(key)?.split(',').filter(Boolean)) ?? [];
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
    if (next.length) sp.set(key, next.join(',')); else sp.delete(key);
  });

  const setSelect = (key: string, value: string) => setParams(sp => {
    if (sp.get(key) === value) sp.delete(key); else sp.set(key, value);
  });

  const setReserved = (key: string, value?: string) => setParams(sp => {
    if (value === undefined || value === '' || sp.get(key) === value) sp.delete(key);
    else sp.set(key, value);
  });

  const toggleBoolean = (key: string) => setParams(sp => {
    if (sp.get(key) === '1') sp.delete(key); else sp.set(key, '1');
  });

  const setRange = (key: string, min?: number, max?: number) => setParams(sp => {
    if (min === undefined) sp.delete(`${key}_min`); else sp.set(`${key}_min`, String(min));
    if (max === undefined) sp.delete(`${key}_max`); else sp.set(`${key}_max`, String(max));
  });

  const setSort = (value: SortOption) => setParams(sp => sp.set('sort', value));

  const clearAll = () => setParams(sp => {
    clearDynamic(sp);
    sp.delete('brand');
  });

  /* ── Data loading ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setIsDesktop(mq.matches); // filters open as a popup, not by default
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    getCategories().then(setCats);
    getBrands().then(setBrandList);
  }, []);

  // Products — re-fetch whenever any query param changes.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getProducts(query).then(res => { if (!cancelled) { setItems(res); setIsLoading(false); } });
    return () => { cancelled = true; };
  }, [query]);

  // Dynamic filters follow the active sub-category (falling back to category).
  useEffect(() => {
    let cancelled = false;
    const slug = query.subCategory ?? query.category ?? '';
    getCategoryFilters(slug).then(f => { if (!cancelled) setFilters(f); });
    return () => { cancelled = true; };
  }, [query.category, query.subCategory]);

  const currentCategory = useMemo(
    () => cats.find(c => c.slug === query.category || c.id === query.category),
    [cats, query.category],
  );

  // category_page banners (admin-managed) for the active category.
  useEffect(() => {
    let cancelled = false;
    if (!query.category) { setCatBanners([]); return; }
    getBanners('category_page', { categoryId: currentCategory?.id })
      .then(b => { if (!cancelled) setCatBanners(b); });
    return () => { cancelled = true; };
  }, [query.category, currentCategory?.id]);

  /* ── Labels & active-filter accounting ── */
  const filterByKey = useMemo(() => {
    const m = new Map<string, ProductFilter>();
    filters.forEach(f => m.set(f.key, f));
    return m;
  }, [filters]);

  const valueLabel = (key: string, value: string) => {
    const fv = filterByKey.get(key)?.values?.find(v => v.value === value);
    return fv ? (language === 'ar' ? fv.labelAr : fv.label) : value;
  };
  const filterLabel = (f: ProductFilter) => (language === 'ar' ? f.labelAr : f.label);

  const priceActive = query.priceMin !== undefined || query.priceMax !== undefined;
  const activeCount =
    (query.brands?.length ?? 0) +
    Object.values(query.attributes ?? {}).reduce((n, v) => n + v.length, 0) +
    Object.keys(query.ranges ?? {}).length +
    (priceActive ? 1 : 0) +
    (query.rating !== undefined ? 1 : 0) +
    (query.hasDiscount ? 1 : 0);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: t.filters.sortOptions.popular },
    { value: 'newest', label: t.filters.sortOptions.newest },
    { value: 'price-asc', label: t.filters.sortOptions.priceAsc },
    { value: 'price-desc', label: t.filters.sortOptions.priceDesc },
    { value: 'rating', label: t.filters.sortOptions.rating },
  ];

  const pageTitle = query.search
    ? `"${query.search}"`
    : (() => {
        const sub = currentCategory?.subCategories?.find(s => s.slug === query.subCategory || s.id === query.subCategory);
        if (sub) return language === 'ar' ? sub.nameAr : sub.name;
        if (currentCategory) return language === 'ar' ? currentCategory.nameAr : currentCategory.name;
        return t.nav.products;
      })();

  /* ── Filter accordion (Nice-One style: each group expands; long lists get a search box) ── */
  const toggleGroup = (key: string) =>
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const setSearch = (key: string, val: string) => setGroupSearch(s => ({ ...s, [key]: val }));

  // Plain render functions (NOT components) so inputs keep focus across re-renders.
  const renderOption = (rowKey: string, active: boolean, label: string, onToggle: () => void, radio?: boolean) => (
    <label key={rowKey} className="flex items-center justify-between py-2 cursor-pointer group">
      <span className="text-[13px] text-[#2D1F1F]/75 group-hover:text-[#2D1F1F] transition-colors">{label}</span>
      <span className={`w-[18px] h-[18px] flex-shrink-0 ${radio ? 'rounded-full' : 'rounded'} border flex items-center justify-center transition-colors ${active ? 'border-[#C9A84C] bg-[#C9A84C]' : 'border-[#2D1F1F]/25 group-hover:border-[#C9A84C]'}`}>
        {active && (radio ? <span className="w-2 h-2 rounded-full bg-white" /> : <Check size={11} className="text-white" />)}
      </span>
      <input type={radio ? 'radio' : 'checkbox'} className="sr-only" checked={active} onChange={onToggle} />
    </label>
  );

  const renderSearchBox = (groupKey: string) => (
    <div className="relative mb-2">
      <Search size={14} className={`absolute top-1/2 -translate-y-1/2 text-[#2D1F1F]/30 ${isRTL ? 'right-3' : 'left-3'}`} />
      <input
        value={groupSearch[groupKey] ?? ''}
        onChange={e => setSearch(groupKey, e.target.value)}
        placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
        className={`w-full h-9 bg-[#FAF7F2] border border-[#2D1F1F]/10 text-[13px] focus:outline-none focus:border-[#C9A84C] ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'}`}
      />
    </div>
  );

  const matches = (label: string, alt: string, q: string) =>
    !q || label.toLowerCase().includes(q.toLowerCase()) || alt.toLowerCase().includes(q.toLowerCase());

  // Body of one filter group.
  const renderGroupBody = (f: ProductFilter) => {
    if (f.key === 'price' && f.type === 'range') {
      const max = query.priceMax ?? PRICE_MAX;
      return (
        <div className="pt-1">
          <input type="range" min={0} max={PRICE_MAX} value={max} onChange={e => setRange('price', query.priceMin, Number(e.target.value))} className="w-full accent-[#C9A84C] mb-2" />
          <div className="flex justify-between text-[11px] text-[#2D1F1F]/50 font-medium">
            <span>OMR {query.priceMin ?? 0}</span><span>OMR {max}</span>
          </div>
        </div>
      );
    }
    if (f.type === 'range' || f.type === 'number') {
      const r = query.ranges?.[f.key] ?? {};
      return (
        <div className={`flex items-center gap-2 pt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <input type="number" inputMode="numeric" placeholder={`${f.min ?? ''}`} value={r.min ?? ''} min={f.min} max={f.max}
            onChange={e => setRange(f.key, e.target.value === '' ? undefined : Number(e.target.value), r.max)}
            className="w-full h-9 px-2 text-sm border border-[#2D1F1F]/15 focus:outline-none focus:border-[#C9A84C]" />
          <span className="text-[#2D1F1F]/30 text-xs">—</span>
          <input type="number" inputMode="numeric" placeholder={`${f.max ?? ''}`} value={r.max ?? ''} min={f.min} max={f.max}
            onChange={e => setRange(f.key, r.min, e.target.value === '' ? undefined : Number(e.target.value))}
            className="w-full h-9 px-2 text-sm border border-[#2D1F1F]/15 focus:outline-none focus:border-[#C9A84C]" />
        </div>
      );
    }
    if (f.type === 'boolean') {
      const on = f.key === 'has_discount' ? !!query.hasDiscount : (query.attributes?.[f.key]?.length ?? 0) > 0;
      return renderOption('offer', on, language === 'ar' ? 'العروض فقط' : 'On offer only', () => (f.key === 'has_discount' ? toggleBoolean('has_discount') : toggleMulti(f.key, '1')));
    }
    const q = groupSearch[f.key] ?? '';
    const showSearch = (f.values?.length ?? 0) >= 6;
    const values = (f.values ?? []).filter(v => matches(v.label, v.labelAr, q));
    const isSingle = f.type === 'select';
    const selectedSingle = f.key === 'rating' ? (query.rating !== undefined ? String(query.rating) : undefined) : query.attributes?.[f.key]?.[0];
    const selectedMulti = query.attributes?.[f.key] ?? [];
    return (
      <div>
        {showSearch && renderSearchBox(f.key)}
        <div className={values.length > 7 ? 'max-h-56 overflow-y-auto pe-1' : ''}>
          {values.map(v => {
            const active = isSingle ? selectedSingle === v.value : selectedMulti.includes(v.value);
            const onToggle = () => isSingle
              ? (f.key === 'rating' ? setReserved('rating', v.value) : setSelect(f.key, v.value))
              : toggleMulti(f.key, v.value);
            return renderOption(v.value, active, language === 'ar' ? v.labelAr : v.label, onToggle, isSingle);
          })}
        </div>
      </div>
    );
  };

  // Selected-count badge per group.
  const groupCount = (f: ProductFilter): number => {
    if (f.key === 'price') return priceActive ? 1 : 0;
    if (f.key === 'rating') return query.rating !== undefined ? 1 : 0;
    if (f.key === 'has_discount') return query.hasDiscount ? 1 : 0;
    if (f.type === 'range' || f.type === 'number') return query.ranges?.[f.key] ? 1 : 0;
    return query.attributes?.[f.key]?.length ?? 0;
  };

  const renderAccordion = (groupKey: string, title: string, count: number, body: React.ReactNode) => {
    const open = openGroups.has(groupKey);
    return (
      <div key={groupKey} className="border-b border-[#2D1F1F]/8">
        <button onClick={() => toggleGroup(groupKey)} className="w-full flex items-center justify-between py-4">
          <span className="flex items-center gap-2 text-[13px] font-bold text-[#2D1F1F]">
            {title}
            {count > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#C9A84C] text-white text-[10px] font-black flex items-center justify-center">{count}</span>}
          </span>
          <ChevronDown size={16} className={`text-[#2D1F1F]/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
              <div className="pb-4">{body}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const brandQ = groupSearch['brand'] ?? '';
  const filteredBrands = brandList.filter(b => matches(b.name, b.nameAr, brandQ));

  const filterPanelContent = (
    <div>
      {/* Brand — independent entity, always first, with search */}
      {renderAccordion('brand', t.filters.brands, query.brands?.length ?? 0, (
        <>
          {renderSearchBox('brand')}
          <div className={filteredBrands.length > 7 ? 'max-h-56 overflow-y-auto pe-1' : ''}>
            {filteredBrands.map(brand =>
              renderOption(brand.id, query.brands?.includes(brand.slug) ?? false, language === 'ar' ? brand.nameAr : brand.name, () => toggleBrand(brand.slug)),
            )}
          </div>
        </>
      ))}

      {/* Dynamic filters delivered per sub-category */}
      {filters.map(f => renderAccordion(f.key, `${filterLabel(f)}${f.unit ? ` (${f.unit})` : ''}`, groupCount(f), renderGroupBody(f)))}
    </div>
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} pt-10 sm:pt-14 pb-6`}>
          {query.category ? (
            <nav className="flex items-center gap-2 text-[11px] font-semibold mb-3">
              <Link href="/" className="text-[#2D1F1F]/40 hover:text-[#C9A84C] transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              <span className="text-[#2D1F1F]/25">/</span>
              <Link href="/products" className="text-[#2D1F1F]/40 hover:text-[#C9A84C] transition-colors">{language === 'ar' ? 'كل المنتجات' : 'All Products'}</Link>
              <span className="text-[#2D1F1F]/25">/</span>
              <span className="text-[#C9A84C]">{pageTitle}</span>
            </nav>
          ) : (
            <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
              {language === 'en' ? 'Browse Our Selection' : 'تصفح مجموعتنا'}
            </span>
          )}
          <div className="flex items-end justify-between gap-6">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{pageTitle}</h1>
            {!isLoading && <p className="text-[#2D1F1F]/40 text-sm pb-1">{items.length} {t.filters.results}</p>}
          </div>
        </div>

        {/* Category rail — shown only on the "all" view; a selected category becomes a focused page */}
        {!query.category && (
        <div className={`${cx} pb-4`}>
          <div className="flex items-center gap-2.5 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => switchCategory(undefined)}
              className={`flex items-center gap-2 h-10 px-5 text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all border ${
                !query.category ? 'border-[#2D1F1F] bg-[#2D1F1F] text-white' : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#2D1F1F]/40'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {cats.map(cat => {
              const active = currentCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => switchCategory(cat.slug)}
                  className={`flex items-center gap-2 h-10 px-5 text-[11px] font-bold tracking-[0.12em] uppercase whitespace-nowrap transition-all border ${
                    active ? 'border-[#C9A84C] bg-[#C9A84C] text-white shadow-gold' : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#2D1F1F]'
                  }`}
                >
                  {language === 'ar' ? cat.nameAr : cat.name}
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Sub-category rail (navigation — appears once a category is active) */}
        {currentCategory?.subCategories && currentCategory.subCategories.length > 0 && (
          <div className={`${cx} pb-5`}>
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setParams(sp => { clearDynamic(sp); sp.delete('subCategory'); })}
                className={`h-8 px-4 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
                  !query.subCategory ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/50 hover:text-[#2D1F1F]'
                }`}
              >
                {language === 'ar' ? 'كل الأقسام' : 'All'}
              </button>
              {currentCategory.subCategories.map(sub => {
                const active = query.subCategory === sub.slug || query.subCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => switchSubCategory(sub.slug)}
                    className={`h-8 px-4 text-[11px] font-semibold tracking-wide whitespace-nowrap rounded-full border transition-colors ${
                      active ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#C9A84C]'
                    }`}
                  >
                    {language === 'ar' ? sub.nameAr : sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* category_page banner */}
      {catBanners.length > 0 && <BannerSection banners={catBanners.slice(0, 1)} ratio="32/9" />}

      {/* Filter & sort toolbar */}
      <div className="border-b border-[#2D1F1F]/8 bg-white sticky top-[68px] z-30">
        <div className={`${cx} h-14 flex items-center justify-between gap-4`}>
          <div className={`flex items-center gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 h-9 px-4 border text-[11px] font-bold tracking-[0.12em] uppercase transition-colors flex-shrink-0 ${
                isFilterOpen ? 'border-[#2D1F1F] bg-[#2D1F1F] text-white' : 'border-[#2D1F1F]/20 text-[#2D1F1F]/70 hover:border-[#2D1F1F]/50'
              }`}
            >
              <SlidersHorizontal size={12} />
              {t.filters.filters}
              {activeCount > 0 && (
                <span className="w-4 h-4 bg-[#C9A84C] text-white text-[9px] font-black flex items-center justify-center">{activeCount}</span>
              )}
            </button>

            {/* Active chips */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {query.brands?.map(slug => {
                const brand = brandList.find(b => b.slug === slug);
                return (
                  <button key={slug} onClick={() => toggleBrand(slug)} className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12">
                    {brand ? (language === 'ar' ? brand.nameAr : brand.name) : slug}
                    <X size={9} />
                  </button>
                );
              })}
              {Object.entries(query.attributes ?? {}).flatMap(([key, vals]) =>
                vals.map(val => (
                  <button key={`${key}-${val}`} onClick={() => toggleMulti(key, val)} className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12">
                    {valueLabel(key, val)}
                    <X size={9} />
                  </button>
                )),
              )}
              {query.rating !== undefined && (
                <button onClick={() => setReserved('rating', undefined)} className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12">
                  {query.rating}★+ <X size={9} />
                </button>
              )}
              {priceActive && (
                <button onClick={() => setRange('price', undefined, undefined)} className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12">
                  OMR {query.priceMin ?? 0}–{query.priceMax ?? PRICE_MAX} <X size={9} />
                </button>
              )}
              {query.hasDiscount && (
                <button onClick={() => toggleBoolean('has_discount')} className="flex items-center gap-1.5 h-7 px-3 bg-[#2D1F1F]/6 text-[#2D1F1F] text-[10px] font-bold tracking-wide uppercase whitespace-nowrap hover:bg-[#2D1F1F]/12">
                  {language === 'ar' ? 'عرض' : 'Offer'} <X size={9} />
                </button>
              )}
              {activeCount > 0 && (
                <button onClick={clearAll} className="h-7 px-3 text-[10px] font-bold tracking-wide uppercase text-[#C9A84C] hover:text-[#2D1F1F] whitespace-nowrap">
                  {t.filters.clearAll}
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <select
              value={query.sort ?? 'popular'}
              onChange={e => setSort(e.target.value as SortOption)}
              className="h-9 pl-3 pr-8 bg-transparent border border-[#2D1F1F]/20 text-[11px] font-bold tracking-[0.1em] uppercase appearance-none cursor-pointer hover:border-[#C9A84C] focus:outline-none focus:border-[#C9A84C] text-[#2D1F1F]"
            >
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown size={10} className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-[#2D1F1F]/50 ${isRTL ? 'left-2' : 'right-2'}`} />
          </div>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
          {/* Grid — full width; filters live in a popup */}
          <div className="min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : items.length === 0 ? (
              <div className="py-28 text-center">
                <p className="text-4xl font-serif text-[#2D1F1F]/10 mb-6">—</p>
                <h3 className="text-xl font-serif text-[#2D1F1F] mb-3">{language === 'en' ? 'No products found' : 'لا توجد منتجات'}</h3>
                <p className="text-[#2D1F1F]/45 text-sm mb-8">{language === 'en' ? 'Try adjusting your filters' : 'حاول تعديل الفلاتر'}</p>
                <button onClick={clearAll} className="px-8 py-3 border border-[#2D1F1F] text-[11px] font-black tracking-[0.25em] uppercase text-[#2D1F1F] hover:bg-[#2D1F1F] hover:text-white transition-colors">
                  {t.filters.clearAll}
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid gap-x-5 gap-y-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {items.map((product, i) => (
                  <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02, duration: 0.3 }}>
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
      </div>

      {/* Filter popup — centered modal on desktop, bottom sheet on mobile */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[60]"
            />
            <motion.div
              initial={isDesktop ? { opacity: 0, x: '-50%', y: '-50%', scale: 0.96 } : { y: '100%' }}
              animate={isDesktop ? { opacity: 1, x: '-50%', y: '-50%', scale: 1 } : { y: 0 }}
              exit={isDesktop ? { opacity: 0, x: '-50%', y: '-50%', scale: 0.96 } : { y: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`fixed z-[70] bg-white flex flex-col shadow-modal ${
                isDesktop
                  ? 'top-1/2 left-1/2 w-[min(560px,92vw)] max-h-[86vh] rounded-2xl'
                  : 'inset-x-0 bottom-0 rounded-t-2xl max-h-[88vh]'
              }`}
            >
              {/* Drag handle (mobile) */}
              {!isDesktop && <div className="mx-auto mt-3 mb-1 h-1 w-10 rounded-full bg-[#2D1F1F]/15" />}

              <div className="flex items-center justify-between px-7 sm:px-8 pt-5 pb-4 border-b border-[#2D1F1F]/8 flex-shrink-0">
                <h2 className="text-sm font-black tracking-[0.2em] uppercase text-[#2D1F1F]">
                  {t.filters.filters}{activeCount > 0 && <span className="ms-2 text-[#C9A84C]">({activeCount})</span>}
                </h2>
                <button onClick={() => setIsFilterOpen(false)} className="w-8 h-8 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F] transition-colors" aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto px-7 sm:px-8 py-6 flex-1">{filterPanelContent}</div>

              <div className="flex gap-3 px-7 sm:px-8 py-4 border-t border-[#2D1F1F]/8 flex-shrink-0 bg-white">
                <button onClick={clearAll} className="h-12 px-5 border border-[#2D1F1F]/20 text-[11px] font-bold tracking-[0.15em] uppercase text-[#2D1F1F]/70 hover:border-[#2D1F1F]/50 transition-colors">
                  {t.filters.clearAll}
                </button>
                <button onClick={() => setIsFilterOpen(false)} className="flex-1 h-12 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#C9A84C] transition-colors">
                  {language === 'ar' ? `عرض ${items.length} منتج` : `Show ${items.length} results`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
