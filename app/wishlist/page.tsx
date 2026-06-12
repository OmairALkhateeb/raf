'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { useState } from 'react';
import { Product } from '@/types';
import { useWishlist } from '@/contexts/WishlistContext';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

export default function WishlistPage() {
  const { items } = useWishlist();
  const { language, t, isRTL } = useLanguage();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Your Collection' : 'مجموعتك'}
          </span>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.nav.wishlist}</h1>
            <p className="text-[#2D1F1F]/40 text-sm pb-1">
              {items.length} {language === 'en' ? 'items saved' : 'منتج محفوظ'}
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`${cx} py-32 text-center`}>
          <Heart size={48} strokeWidth={1} className="text-[#2D1F1F]/15 mx-auto mb-8" />
          <h2 className="text-2xl font-serif text-[#2D1F1F] mb-3">
            {language === 'en' ? 'Your wishlist is empty' : 'قائمة المفضلة فارغة'}
          </h2>
          <p className="text-[#2D1F1F]/45 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
            {language === 'en'
              ? 'Save items you love by clicking the heart icon on any product'
              : 'احفظ المنتجات التي تحبها بالنقر على أيقونة القلب'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-[#2D1F1F] text-white px-10 py-3.5 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#C9A84C] transition-colors duration-300"
          >
            {language === 'en' ? 'Explore Products' : 'استكشف المنتجات'}
            <ArrowRight size={14} className={isRTL ? 'rtl-flip' : ''} />
          </Link>
        </div>
      ) : (
        <div className={`${cx} py-10 sm:py-14`}>
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10"
          >
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
