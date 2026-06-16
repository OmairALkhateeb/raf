'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, SubCategory } from '@/types';
import { categories } from '@/data/categories';
import { getFeaturedBrands } from '@/data/brands';
import { filtersBySubCategory, filtersByCategory } from '@/data/filters';
import { useLanguage } from '@/contexts/LanguageContext';

// Nice-One-style hover mega menu (desktop). Three regions:
//   [ main categories ] [ sub-category columns w/ leaf links ] [ brands + featured art ]
// Leaf links under each sub-category are derived from that sub-category's primary
// dynamic filter (e.g. skin types) so the columns are rich AND deep-link straight
// into a filtered listing — nothing unrelated to the category is ever shown.

const featuredBrands = getFeaturedBrands().slice(0, 6);

interface Leaf { key: string; name: string; nameAr: string; href: string }

function leafLinks(catSlug: string, sub: SubCategory): Leaf[] {
  const base = `/products?category=${catSlug}&subCategory=${sub.slug}`;
  const fs = filtersBySubCategory[sub.slug] ?? [];
  const primary = fs.find(
    f => (f.type === 'select' || f.type === 'multi_select') && !['rating', 'has_discount'].includes(f.key),
  );
  // Preferred: deep-link into the sub-category's primary attribute values.
  if (primary?.values?.length) {
    return primary.values.slice(0, 6).map(v => ({
      key: `${primary.key}:${v.value}`,
      name: v.label,
      nameAr: v.labelAr,
      href: `${base}&${primary.key}=${v.value}`,
    }));
  }
  // Fallback for sub-categories without bespoke filters → curated, always-populated links.
  return [
    { key: 'pop', name: 'Bestsellers', nameAr: 'الأكثر مبيعاً', href: `${base}&sort=popular` },
    { key: 'new', name: 'New Arrivals', nameAr: 'وصل حديثاً', href: `${base}&sort=newest` },
    { key: 'offers', name: 'On Offer', nameAr: 'العروض', href: `${base}&has_discount=1` },
    { key: 'price-asc', name: 'Lowest Price', nameAr: 'الأقل سعراً', href: `${base}&sort=price-asc` },
  ];
}

export default function MegaMenu() {
  const { language, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Chevron = isRTL ? ChevronLeft : ChevronDown;

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, [cancelClose]);

  const openOn = (id: string) => { cancelClose(); setActiveId(id); setOpen(true); };

  const active: Category | undefined = categories.find(c => c.id === activeId);
  const name = (c: { name: string; nameAr: string }) => (language === 'ar' ? c.nameAr : c.name);

  // Quick-pick categories shown inline in the bar (the rest live inside the panel).
  const inlineCats = categories.slice(0, 4);

  return (
    <div
      className="hidden lg:flex items-center gap-7 flex-1 justify-center"
      onMouseLeave={scheduleClose}
      onMouseEnter={cancelClose}
    >
      {/* "All Categories" trigger */}
      <button
        onMouseEnter={() => openOn(categories[0]?.id ?? '')}
        className={`flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors ${
          open ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/80 hover:text-[#C9A84C]'
        }`}
      >
        {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
        <Chevron size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Inline category quick links */}
      {inlineCats.map(cat => (
        <Link
          key={cat.id}
          href={`/products?category=${cat.slug}`}
          onMouseEnter={() => openOn(cat.id)}
          onClick={() => setOpen(false)}
          className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors whitespace-nowrap relative group ${
            open && activeId === cat.id ? 'text-[#C9A84C]' : 'text-[#2D1F1F]/70 hover:text-[#C9A84C]'
          }`}
        >
          {name(cat)}
          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#C9A84C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
      ))}

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && active && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 right-0 top-full bg-white border-t border-[#2D1F1F]/8 shadow-[0_24px_48px_rgba(0,0,0,0.12)] z-50"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
              <div className="flex gap-8 py-8 max-h-[78vh]">

                {/* Region 1 — main categories */}
                <nav className="w-52 flex-shrink-0 border-e border-[#2D1F1F]/8 pe-6">
                  <ul className="space-y-0.5">
                    {categories.map(cat => {
                      const on = cat.id === activeId;
                      return (
                        <li key={cat.id}>
                          <Link
                            href={`/products?category=${cat.slug}`}
                            onMouseEnter={() => setActiveId(cat.id)}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-sm transition-colors ${
                              on ? 'bg-[#FAF7F2] text-[#C9A84C]' : 'text-[#2D1F1F]/80 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <span className="text-[13px] font-semibold">{name(cat)}</span>
                            <Chevron size={13} className={on ? 'opacity-100' : 'opacity-30'} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Region 2 — sub-category columns with leaf links */}
                <div className="flex-1 min-w-0 overflow-y-auto">
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-7">
                    {/* "All of {category}" shortcut */}
                    <div>
                      <Link
                        href={`/products?category=${active.slug}`}
                        onClick={() => setOpen(false)}
                        className="text-[12px] font-black tracking-wide text-[#2D1F1F] hover:text-[#C9A84C] flex items-center gap-1.5 mb-3"
                      >
                        {language === 'ar' ? `كل ${name(active)}` : `All ${name(active)}`}
                        <Chevron size={12} />
                      </Link>
                    </div>

                    {(active.subCategories ?? []).map(sub => (
                      <div key={sub.id}>
                        <Link
                          href={`/products?category=${active.slug}&subCategory=${sub.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-[12px] font-black tracking-wide text-[#2D1F1F] hover:text-[#C9A84C] flex items-center gap-1.5 mb-3"
                        >
                          {name(sub)}
                          <Chevron size={12} />
                        </Link>
                        <ul className="space-y-2">
                          {leafLinks(active.slug, sub).map(leaf => (
                            <li key={leaf.key}>
                              <Link
                                href={leaf.href}
                                onClick={() => setOpen(false)}
                                className="text-[12.5px] text-[#2D1F1F]/55 hover:text-[#C9A84C] transition-colors"
                              >
                                {name(leaf)}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Region 3 — brands + featured art */}
                <div className="w-72 flex-shrink-0 border-s border-[#2D1F1F]/8 ps-6">
                  <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/40 mb-3">
                    {language === 'ar' ? 'العلامات التجارية' : 'Brands'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {featuredBrands.map(brand => (
                      <Link
                        key={brand.id}
                        href={`/products?brand=${brand.slug}`}
                        onClick={() => setOpen(false)}
                        className="h-14 border border-[#2D1F1F]/10 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors flex items-center justify-center bg-white px-2 text-center"
                        title={name(brand)}
                      >
                        <span className="text-[12px] font-bold tracking-wide text-[#2D1F1F]/70">{name(brand)}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Featured art for the active category */}
                  <Link
                    href={`/products?category=${active.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative block overflow-hidden group"
                    style={{ aspectRatio: '16/10' }}
                  >
                    <Image src={active.image} alt={name(active)} fill sizes="288px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-3 inset-x-3 text-white text-sm font-serif">{name(active)}</span>
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
