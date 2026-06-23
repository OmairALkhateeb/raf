'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Brand } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrandShowcaseProps {
  brands: Brand[];
}

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
  const { language, t, isRTL } = useLanguage();

  return (
    <section className="py-20 bg-[#1A1210]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <span className="text-[10px] font-black tracking-[0.45em] uppercase mb-4 text-[#C9A84C]">
            {language === 'ar' ? 'متاجر العلامات' : 'Brand Stores'}
          </span>
          <div className={`flex items-center gap-5 w-full max-w-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1 h-px bg-[#C9A84C]/25" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white whitespace-nowrap">
              {t.home.ourBrands}
            </h2>
            <div className="flex-1 h-px bg-[#C9A84C]/25" />
          </div>
          <p className="text-white/35 text-sm mt-4 max-w-md">{t.home.ourBrandsDesc}</p>
        </motion.div>

        {/* Brands row */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-px bg-white/5">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link
                href={`/brands/${brand.slug}`}
                className="group flex flex-col items-center gap-4 p-6 bg-[#1A1210] hover:bg-[#231815] transition-colors duration-300 border border-transparent hover:border-[#C9A84C]/20"
              >
                {/* Monogram (no real logo asset in mock mode) */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/8 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-[#C9A84C]/40 transition-all duration-300">
                  <span className="font-serif text-2xl text-[#C9A84C]">
                    {(language === 'ar' ? brand.nameAr : brand.name).charAt(0)}
                  </span>
                </div>

                {/* Brand name */}
                <div className="text-center">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 group-hover:text-[#C9A84C] transition-colors duration-300">
                    {language === 'ar' ? brand.nameAr : brand.name}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View all brands */}
        <div className="flex justify-center mt-12">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-3 border border-[#C9A84C]/50 text-[#C9A84C] px-8 py-3.5 text-[11px] font-black tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#1A1210] transition-all duration-300"
          >
            {language === 'ar' ? 'كل العلامات التجارية' : 'All Brands'}
            <ArrowRight size={14} className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
