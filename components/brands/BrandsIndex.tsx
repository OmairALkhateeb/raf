'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Brand } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrandsIndexProps {
  brands: Brand[];
}

export default function BrandsIndex({ brands }: BrandsIndexProps) {
  const { language, isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <section className="bg-[#2D1F1F] text-white">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 text-center">
          <span className="block text-[10px] font-black tracking-[0.45em] uppercase text-[#C9A84C] mb-4">
            {language === 'ar' ? 'متاجر العلامات' : 'Brand Stores'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif">
            {language === 'ar' ? 'تسوّق حسب العلامة التجارية' : 'Shop by Brand'}
          </h1>
          <p className="text-white/45 text-sm mt-4 max-w-md mx-auto">
            {language === 'ar'
              ? 'اكتشف متجراً مصغّراً لكل علامة مع كامل منتجاتها وتوصيات مختارة'
              : 'Explore a dedicated mini-store for every brand — full catalogue and curated picks'}
          </p>
        </div>
      </section>

      {/* Brand cards */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, i) => {
            const name = language === 'ar' ? brand.nameAr : brand.name;
            const tagline = language === 'ar' ? brand.taglineAr : brand.tagline;
            return (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.45 }}
              >
                <Link href={`/brands/${brand.slug}`} className="group block bg-white overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 rounded-2xl">
                  {/* Banner */}
                  <div className="relative h-36 overflow-hidden" style={{ backgroundColor: brand.accentColor ?? '#2D1F1F' }}>
                    {brand.banner && (
                      <Image src={brand.banner} alt={name} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  {/* Logo + identity */}
                  <div className="px-6 pb-6">
                    <div className="w-16 h-16 -mt-9 mb-3 bg-white shadow-md ring-1 ring-black/5 overflow-hidden rounded-lg">
                      <Image src={brand.logo} alt={name} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-lg font-serif text-[#2D1F1F] group-hover:text-[#C9A84C] transition-colors">{name}</h2>
                    {tagline && <p className="text-[#C9A84C] text-[11px] font-bold tracking-wide uppercase mt-0.5">{tagline}</p>}
                    <p className="text-[#2D1F1F]/55 text-[13px] leading-relaxed mt-2 line-clamp-2">
                      {language === 'ar' ? brand.descriptionAr : brand.description}
                    </p>
                    <span className={`inline-flex items-center gap-1.5 mt-4 text-[11px] font-black tracking-[0.15em] uppercase text-[#2D1F1F] group-hover:text-[#C9A84C] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {language === 'ar' ? 'زيارة المتجر' : 'Visit Store'}
                      <ArrowRight size={13} className={isRTL ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
