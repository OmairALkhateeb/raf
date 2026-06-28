'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  label?: string;
  viewAllHref?: string;
  dark?: boolean;
}

export default function FeaturedProducts({
  products,
  title,
  subtitle,
  label,
  viewAllHref = '/products',
  dark = false,
}: FeaturedProductsProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { t, isRTL } = useLanguage();

  const bg = dark ? 'bg-[#2D1F1F]' : 'bg-white';
  const headingColor = dark ? 'text-white' : 'text-[#2D1F1F]';
  const subColor = dark ? 'text-white/50' : 'text-gray-400';
  const labelColor = dark ? 'text-[#C9A84C]' : 'text-[#C9A84C]';
  const lineColor = dark ? 'bg-[#C9A84C]/40' : 'bg-[#C9A84C]/30';

  return (
    <section className={`py-20 ${bg}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14"
        >
          {/* Overline label */}
          {label && (
            <span className={`text-[10px] font-black tracking-[0.45em] uppercase mb-4 ${labelColor}`}>
              {label}
            </span>
          )}

          {/* Decorative line + heading + line */}
          <div className={`flex items-center gap-5 w-full max-w-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 h-px ${lineColor}`} />
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-serif font-bold ${headingColor} whitespace-nowrap`}>
              {title || t.home.featuredProducts}
            </h2>
            <div className={`flex-1 h-px ${lineColor}`} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-sm mt-4 leading-relaxed max-w-md ${subColor}`}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              <ProductCard product={product} onQuickView={setQuickViewProduct} />
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-14"
        >
          <Link
            href={viewAllHref}
            className={`group inline-flex items-center gap-3 border px-8 py-3.5 text-[11px] font-black tracking-[0.3em] uppercase rounded-md transition-all duration-300 ${
              dark
                ? 'border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#2D1F1F] hover:border-[#C9A84C]'
                : 'border-[#2D1F1F]/20 text-[#2D1F1F] hover:bg-[#2D1F1F] hover:text-white hover:border-[#2D1F1F]'
            }`}
          >
            {t.home.viewAll}
            <ArrowRight
              size={14}
              className={`transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
            />
          </Link>
        </motion.div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
