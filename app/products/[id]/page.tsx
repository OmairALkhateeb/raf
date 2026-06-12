'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { ShoppingBag, Heart, Share2, ChevronLeft, ChevronRight, Star, CheckCircle, Truck, RotateCcw, Shield, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/common/Breadcrumb';
import Rating from '@/components/common/Rating';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { getProductById, getProductsByCategory } from '@/data/products';
import { getReviewsByProductId } from '@/data/reviews';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id);

  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedSize, setSelectedSize] = useState<string>();
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast, addToRecentlyViewed } = useApp();
  const { language, t, isRTL } = useLanguage();

  useEffect(() => {
    if (product) addToRecentlyViewed(product);
  }, [product?.id]);

  if (!product) return notFound();

  const name = language === 'ar' ? product.nameAr : product.name;
  const brand = language === 'ar' ? product.brandAr : product.brand;
  const description = language === 'ar' ? product.descriptionAr : product.description;
  const inWishlist = isInWishlist(product.id);
  const reviews = getReviewsByProductId(product.id);
  const related = getProductsByCategory(product.categoryId).filter(p => p.id !== product.id).slice(0, 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    showToast(t.common.addedToCart);
  };

  const breadcrumbs = [
    { label: language === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
    { label: language === 'ar' ? 'المنتجات' : 'Products', href: '/products' },
    { label: language === 'ar' ? (product.categoryAr || product.category) : product.category, href: `/products?category=${product.categoryId}` },
    { label: name },
  ];

  const tabs = [
    { key: 'description' as const, label: language === 'en' ? 'Description' : 'الوصف' },
    { key: 'specs' as const, label: t.product.specifications },
    { key: 'reviews' as const, label: `${t.product.reviews} (${reviews.length})` },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Breadcrumb bar */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} h-12 flex items-center`}>
          <Breadcrumb crumbs={breadcrumbs} />
        </div>
      </div>

      {/* Product section */}
      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 xl:gap-24">

          {/* Image gallery */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative overflow-hidden bg-[#F5F3EF] group" style={{ aspectRatio: '4/5' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImg]}
                    alt={name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className={`absolute top-4 flex flex-col gap-2 z-10 ${isRTL ? 'right-4' : 'left-4'}`}>
                {product.discount && (
                  <span className="px-3 py-1 bg-[#C9A84C] text-white text-[10px] font-black tracking-widest uppercase">
                    −{product.discount}%
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 bg-[#2D1F1F] text-[#E8D5A3] text-[10px] font-black tracking-widest uppercase">
                    {t.product.new}
                  </span>
                )}
              </div>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                    className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white ${
                      isRTL ? 'right-3' : 'left-3'
                    }`}
                  >
                    <ChevronLeft size={16} className={isRTL ? 'rtl-flip' : ''} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                    className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white ${
                      isRTL ? 'left-3' : 'right-3'
                    }`}
                  >
                    <ChevronRight size={16} className={isRTL ? 'rtl-flip' : ''} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-20 h-20 overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#C9A84C]' : 'border-transparent hover:border-[#2D1F1F]/25'
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {/* Brand */}
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-[#C9A84C] mb-3">{brand}</p>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#2D1F1F] leading-tight mb-4">{name}</h1>

            {/* Rating + stock */}
            <div className={`flex items-center gap-5 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Rating value={product.rating} count={product.reviewCount} size={14} />
              <span className={`text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1 ${
                product.inStock
                  ? 'text-[#C9A84C] bg-[#C9A84C]/10'
                  : 'text-red-500 bg-red-50'
              }`}>
                {product.inStock ? `✓ ${t.product.inStock}` : t.product.outOfStock}
              </span>
            </div>

            {/* Price */}
            <div className={`flex items-baseline gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-3xl font-bold text-[#2D1F1F]">
                {language === 'ar' ? `${product.price.toFixed(3)} ر.ع.` : `OMR ${product.price.toFixed(3)}`}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#2D1F1F]/30 line-through">
                    {language === 'ar' ? `${product.originalPrice.toFixed(3)} ر.ع.` : `OMR ${product.originalPrice.toFixed(3)}`}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#C9A84C]/12 text-[#C9A84C] text-xs font-bold">
                    −{product.discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-[#2D1F1F]/55 leading-relaxed mb-7">{description}</p>

            {/* Colors */}
            {product.colors && (
              <div className="mb-6">
                <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/50">
                    {t.product.selectColor}
                  </span>
                  {selectedColor && <span className="text-xs text-[#C9A84C] font-medium">{selectedColor}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2 text-xs font-medium border transition-all ${
                        selectedColor === color
                          ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/8'
                          : 'border-[#2D1F1F]/20 text-[#2D1F1F]/70 hover:border-[#2D1F1F]/50'
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
              <div className="mb-6">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/50 block mb-3">
                  {t.product.selectSize}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                          : 'border-[#2D1F1F]/20 text-[#2D1F1F]/70 hover:border-[#C9A84C]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-7">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D1F1F]/50 block mb-3">
                {t.product.quantity}
              </span>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center border border-[#2D1F1F]/15 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#2D1F1F] border-x border-[#2D1F1F]/15 h-11 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stockCount, q + 1))}
                    className="w-11 h-11 flex items-center justify-center text-[#2D1F1F]/50 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-xs text-[#2D1F1F]/35 font-medium">
                  {product.stockCount} {language === 'en' ? 'available' : 'متاح'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className={`flex gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-13 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 hover:bg-[#C9A84C] transition-colors duration-300 disabled:opacity-40"
                style={{ height: 52 }}
              >
                <ShoppingBag size={16} />
                {t.product.addToCart}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { toggleWishlist(product); showToast(inWishlist ? t.common.removedFromWishlist : t.common.addedToWishlist); }}
                className={`w-13 h-13 border-2 flex items-center justify-center transition-all ${
                  inWishlist
                    ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]'
                    : 'border-[#2D1F1F]/20 text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
                style={{ width: 52, height: 52 }}
              >
                <Heart size={17} className={inWishlist ? 'fill-[#C9A84C]' : ''} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied!', 'info'); }}
                className="border-2 border-[#2D1F1F]/20 flex items-center justify-center text-[#2D1F1F]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
                style={{ width: 52, height: 52 }}
              >
                <Share2 size={17} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className={`grid grid-cols-3 gap-0 border-t border-[#2D1F1F]/8 pt-6`}>
              {[
                { icon: Truck, label: language === 'en' ? 'Free Delivery' : 'توصيل مجاني', sub: language === 'en' ? 'Over OMR 10' : 'فوق 10 ر.ع.' },
                { icon: RotateCcw, label: language === 'en' ? 'Easy Returns' : 'إرجاع سهل', sub: language === 'en' ? '14 days' : '14 يوم' },
                { icon: Shield, label: language === 'en' ? 'Authentic' : 'أصيل 100%', sub: language === 'en' ? 'Guaranteed' : 'مضمون' },
              ].map((item, i) => (
                <div key={i} className={`flex flex-col items-center gap-1.5 text-center ${i > 0 ? 'border-l border-[#2D1F1F]/8' : ''}`}>
                  <item.icon size={16} className="text-[#C9A84C]" />
                  <span className="text-[11px] font-bold text-[#2D1F1F]">{item.label}</span>
                  <span className="text-[10px] text-[#2D1F1F]/40">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="border-t border-[#2D1F1F]/8">
        <div className={`${cx}`}>
          {/* Tab bar */}
          <div className={`flex border-b border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-[11px] font-black tracking-[0.2em] uppercase border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-[#C9A84C] text-[#C9A84C]'
                    : 'border-transparent text-[#2D1F1F]/40 hover:text-[#2D1F1F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-10 sm:py-14">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div key="desc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <p className="text-[#2D1F1F]/65 leading-relaxed max-w-2xl text-sm">{description}</p>
                  <div className={`flex flex-wrap gap-2 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {product.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 border border-[#2D1F1F]/12 text-[10px] font-bold tracking-[0.15em] uppercase text-[#2D1F1F]/50">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div key="specs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="max-w-lg border border-[#2D1F1F]/8">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className={`flex items-stretch ${i > 0 ? 'border-t border-[#2D1F1F]/8' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="w-2/5 px-5 py-3.5 text-[11px] font-black tracking-[0.1em] uppercase text-[#2D1F1F]/40 bg-[#FAF7F2] border-r border-[#2D1F1F]/8">
                          {language === 'ar' ? spec.keyAr : spec.key}
                        </span>
                        <span className="flex-1 px-5 py-3.5 text-sm text-[#2D1F1F]">
                          {language === 'ar' ? spec.valueAr : spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {reviews.length === 0 ? (
                    <p className="text-[#2D1F1F]/40 text-sm">{t.product.noReviews}</p>
                  ) : (
                    <div className="space-y-5 max-w-2xl">
                      {reviews.map(review => (
                        <div key={review.id} className="border border-[#2D1F1F]/8 p-6">
                          <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div>
                              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-sm font-bold text-[#2D1F1F]">{review.author}</span>
                                {review.verified && (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#C9A84C]">
                                    <CheckCircle size={10} /> {t.product.verifiedPurchase}
                                  </span>
                                )}
                              </div>
                              <div className={`flex items-center gap-0.5 mt-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={11}
                                    className={i < Math.floor(review.rating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2D1F1F]/15 fill-[#2D1F1F]/15'}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-[#2D1F1F]/35">{review.date}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#2D1F1F] mb-2">{review.title}</h4>
                          <p className="text-sm text-[#2D1F1F]/55 leading-relaxed">{review.body}</p>
                          <p className="text-xs text-[#2D1F1F]/30 mt-3">
                            {review.helpful} {language === 'en' ? 'found this helpful' : 'وجدوا هذا مفيداً'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t border-[#2D1F1F]/8">
          <FeaturedProducts
            products={related}
            label={language === 'en' ? 'From the Same Collection' : 'من نفس المجموعة'}
            title={t.product.relatedProducts}
            viewAllHref={`/products?category=${product.categoryId}`}
          />
        </div>
      )}
    </div>
  );
}
