'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Package, ChevronRight } from 'lucide-react';
import { Brand, Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrandStoreProps {
  brand: Brand;
  products: Product[];
  related: Product[];
}

export default function BrandStore({ brand, products, related }: BrandStoreProps) {
  const { language, t, isRTL } = useLanguage();
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const name = language === 'ar' ? brand.nameAr : brand.name;
  const tagline = language === 'ar' ? brand.taglineAr : brand.tagline;
  const description = language === 'ar' ? brand.descriptionAr : brand.description;
  const accent = brand.accentColor ?? '#2D1F1F';

  // Category chips derived from the brand's own catalogue (navigation, client-side).
  const chips = useMemo(() => {
    const map = new Map<string, { id: string; name: string; nameAr: string }>();
    products.forEach(p => {
      if (!map.has(p.categoryId)) map.set(p.categoryId, { id: p.categoryId, name: p.category, nameAr: p.categoryAr });
    });
    return Array.from(map.values());
  }, [products]);

  const visible = activeCat ? products.filter(p => p.categoryId === activeCat) : products;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ── Brand hero / banner ── */}
      <section className="relative" style={{ backgroundColor: accent }}>
        <div className="relative h-[240px] sm:h-[320px] lg:h-[380px] overflow-hidden">
          {brand.banner && (
            <Image
              src={brand.banner}
              alt={name}
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accent}, ${accent}99, transparent)` }} />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-0 inset-x-0">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-5">
            <nav className="flex items-center gap-2 text-[11px] font-semibold text-white/70">
              <Link href="/" className="hover:text-[#C9A84C] transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
              <ChevronRight size={11} className={isRTL ? 'rotate-180' : ''} />
              <Link href="/brands" className="hover:text-[#C9A84C] transition-colors">{t.nav.brands}</Link>
              <ChevronRight size={11} className={isRTL ? 'rotate-180' : ''} />
              <span className="text-[#C9A84C]">{name}</span>
            </nav>
          </div>
        </div>

        {/* Logo + identity lockup */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className={`relative -mt-16 sm:-mt-20 pb-8 flex flex-col sm:flex-row sm:items-end gap-5 ${isRTL ? 'sm:flex-row-reverse text-right' : ''}`}>
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.25)] ring-1 ring-black/5 overflow-hidden rounded-xl">
              <Image src={brand.logo} alt={name} width={128} height={128} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 sm:pb-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white">{name}</h1>
              {tagline && <p className="text-[#C9A84C] text-sm font-semibold tracking-wide mt-1">{tagline}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ── Description + stats ── */}
      <section className="bg-white border-b border-[#2D1F1F]/8">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-7">
          <div className={`flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <p className="text-[#2D1F1F]/70 text-sm leading-relaxed max-w-2xl flex-1">{description}</p>
            <div className={`flex items-center gap-6 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2 text-[#2D1F1F]/60 text-[13px] font-semibold">
                <MapPin size={15} className="text-[#C9A84C]" />
                {brand.origin}
              </div>
              <div className="flex items-center gap-2 text-[#2D1F1F]/60 text-[13px] font-semibold">
                <Package size={15} className="text-[#C9A84C]" />
                {products.length} {language === 'ar' ? 'منتج' : 'products'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category chips ── */}
      {chips.length > 1 && (
        <div className="bg-white sticky top-[68px] z-30 border-b border-[#2D1F1F]/8">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-3.5">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setActiveCat(null)}
                className={`h-9 px-4 text-[11px] font-bold tracking-wide whitespace-nowrap rounded-md border transition-colors ${
                  !activeCat ? 'border-[#C9A84C] bg-[#C9A84C] text-white' : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#C9A84C]'
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              {chips.map(chip => {
                const active = activeCat === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveCat(chip.id)}
                    className={`h-9 px-4 text-[11px] font-bold tracking-wide whitespace-nowrap rounded-md border transition-colors ${
                      active ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#2D1F1F]/15 text-[#2D1F1F]/60 hover:border-[#C9A84C]'
                    }`}
                  >
                    {language === 'ar' ? chip.nameAr : chip.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Brand product grid ── */}
      <section className="bg-[#FAF7F2]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
          {visible.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-[#2D1F1F]/45 text-sm">{language === 'en' ? 'No products in this section yet.' : 'لا توجد منتجات في هذا القسم بعد.'}</p>
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: (i % 5) * 0.05, duration: 0.4 }}
                >
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Recommended / related ── */}
      {related.length > 0 && (
        <FeaturedProducts
          products={related.slice(0, 5)}
          label={language === 'ar' ? 'قد يعجبك أيضاً' : 'You May Also Like'}
          title={language === 'ar' ? 'توصيات لك' : 'Recommended For You'}
          viewAllHref="/products"
        />
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
