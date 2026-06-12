'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Heart, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Rating from '@/components/common/Rating';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useApp();
  const { language, t, isRTL } = useLanguage();

  useEffect(() => {
    setActiveImg(0);
    setSelectedColor(undefined);
    setSelectedSize(undefined);
    setQuantity(1);
  }, [product?.id]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const name = language === 'ar' ? product.nameAr : product.name;
  const brand = language === 'ar' ? product.brandAr : product.brand;
  const description = language === 'ar' ? product.descriptionAr : product.description;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    showToast(t.common.addedToCart);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/65 z-[80] flex items-center justify-center p-4 sm:p-8"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="bg-white max-w-3xl w-full max-h-[92vh] overflow-y-auto relative"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-4 z-20 w-8 h-8 bg-white border border-[#2D1F1F]/12 flex items-center justify-center hover:border-[#2D1F1F] transition-colors ${
              isRTL ? 'left-4' : 'right-4'
            }`}
          >
            <X size={14} />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Images */}
            <div className="bg-[#F5F3EF]">
              <div className="relative" style={{ aspectRatio: '1/1' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Image src={product.images[activeImg]} alt={name} fill className="object-cover" sizes="400px" />
                  </motion.div>
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                      className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 flex items-center justify-center hover:bg-white transition-colors ${
                        isRTL ? 'right-2' : 'left-2'
                      }`}
                    >
                      <ChevronLeft size={14} className={isRTL ? 'rtl-flip' : ''} />
                    </button>
                    <button
                      onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                      className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 flex items-center justify-center hover:bg-white transition-colors ${
                        isRTL ? 'left-2' : 'right-2'
                      }`}
                    >
                      <ChevronRight size={14} className={isRTL ? 'rtl-flip' : ''} />
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className={`flex gap-2 p-3 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-12 h-12 overflow-hidden border-2 transition-colors ${
                        activeImg === i ? 'border-[#C9A84C]' : 'border-transparent hover:border-[#2D1F1F]/20'
                      }`}
                    >
                      <Image src={img} alt="" width={48} height={48} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-7 flex flex-col">
              <div className="flex-1">
                <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#C9A84C] mb-2">{brand}</p>
                <h2 className="text-xl font-serif text-[#2D1F1F] leading-snug mb-3">{name}</h2>

                <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Rating value={product.rating} count={product.reviewCount} />
                  <span className={`text-[10px] font-black tracking-[0.1em] uppercase px-2.5 py-1 ${
                    product.inStock ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-red-50 text-red-500'
                  }`}>
                    {product.inStock ? t.product.inStock : t.product.outOfStock}
                  </span>
                </div>

                <div className={`flex items-baseline gap-3 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl font-bold text-[#2D1F1F]">
                    {language === 'ar' ? `${product.price.toFixed(3)} ر.ع.` : `OMR ${product.price.toFixed(3)}`}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#2D1F1F]/30 line-through">
                      {language === 'ar' ? `${product.originalPrice.toFixed(3)} ر.ع.` : `OMR ${product.originalPrice.toFixed(3)}`}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-[10px] font-black bg-[#C9A84C] text-white px-2 py-0.5">−{product.discount}%</span>
                  )}
                </div>

                <p className="text-sm text-[#2D1F1F]/55 leading-relaxed mb-5 line-clamp-3">{description}</p>

                {/* Colors */}
                {product.colors && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2">{t.product.selectColor}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-1.5 text-xs border transition-all font-medium ${
                            selectedColor === color
                              ? 'border-[#C9A84C] bg-[#C9A84C]/8 text-[#C9A84C]'
                              : 'border-[#2D1F1F]/15 text-[#2D1F1F]/70 hover:border-[#2D1F1F]/40'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2">{t.product.selectSize}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-9 text-xs border font-bold transition-all ${
                            selectedSize === size
                              ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                              : 'border-[#2D1F1F]/15 text-[#2D1F1F]/70 hover:border-[#C9A84C]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-5">
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/45 mb-2">{t.product.quantity}</p>
                  <div className={`flex items-center border border-[#2D1F1F]/15 w-fit ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#2D1F1F] border-x border-[#2D1F1F]/15 h-9 flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                      className="w-9 h-9 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`flex gap-2 pt-5 border-t border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-11 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.18em] uppercase flex items-center justify-center gap-2 hover:bg-[#C9A84C] transition-colors disabled:opacity-40"
                >
                  <ShoppingBag size={14} />
                  {t.product.addToCart}
                </button>
                <button
                  onClick={() => { toggleWishlist(product); showToast(inWishlist ? t.common.removedFromWishlist : t.common.addedToWishlist); }}
                  className={`w-11 h-11 border-2 flex items-center justify-center transition-all ${
                    inWishlist
                      ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                      : 'border-[#2D1F1F]/20 text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                  }`}
                >
                  <Heart size={15} className={inWishlist ? 'fill-[#C9A84C]' : ''} />
                </button>
              </div>

              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="text-center text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/35 hover:text-[#C9A84C] mt-4 transition-colors"
              >
                {language === 'en' ? 'View Full Details →' : 'عرض التفاصيل الكاملة →'}
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
