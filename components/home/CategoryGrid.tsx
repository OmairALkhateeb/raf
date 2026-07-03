'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { language, t, isRTL } = useLanguage();

  return (
    <section className="pt-6 pb-14 sm:pt-12 sm:pb-20 lg:py-20 bg-[#FAF7F2]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-8 sm:mb-12 lg:mb-14"
        >
          <span className="text-[10px] font-black tracking-[0.45em] uppercase mb-2 sm:mb-4 text-[#C9A84C]">
            {language === 'ar' ? 'اكتشف' : 'Discover'}
          </span>
          <div className={`flex items-center gap-5 w-full max-w-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex-1 h-px bg-[#C9A84C]/30" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D1F1F] whitespace-nowrap">
              {t.home.shopByCategory}
            </h2>
            <div className="flex-1 h-px bg-[#C9A84C]/30" />
          </div>
        </motion.div>

        {/* Category tiles — editorial layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                className="group block"
              >
                {/* Image block */}
                <div
                  className="relative overflow-hidden bg-[#2D1F1F] mb-4 rounded-xl"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={cat.image}
                    alt={language === 'ar' ? cat.nameAr : cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
                  />

                  {/* Full overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Icon + count at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/60 font-medium tracking-widest uppercase">
                      {cat.productCount}+ {language === 'ar' ? 'منتج' : 'items'}
                    </span>
                  </div>

                  {/* Arrow overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 border border-[#C9A84C] flex items-center justify-center rounded-md">
                      <ArrowRight
                        size={16}
                        className={`text-[#C9A84C] ${isRTL ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Category name */}
                <div className="text-center">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#2D1F1F] group-hover:text-[#C9A84C] transition-colors duration-300">
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
