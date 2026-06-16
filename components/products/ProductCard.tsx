'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';
import { getBrandBySlug } from '@/data/brands';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast, addToRecentlyViewed } = useApp();
  const { language, t, isRTL } = useLanguage();

  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  const name = language === 'ar' ? product.nameAr : product.name;
  const brand = language === 'ar' ? product.brandAr : product.brand;
  const brandSlug = getBrandBySlug(product.brandId)?.slug ?? product.brandId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(t.common.addedToCart);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(inWishlist ? t.common.removedFromWishlist : t.common.addedToWishlist);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
    addToRecentlyViewed(product);
  };

  return (
    <motion.article
      className="group relative flex flex-col"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={false}
    >
      {/* ── Image Container ── */}
      <Link
        href={`/products/${product.id}`}
        onClick={() => addToRecentlyViewed(product)}
        className="block relative overflow-hidden bg-[#F5F3EF]"
        style={{ aspectRatio: '4/5' }}
      >
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#EFECEA] via-[#E6E3DE] to-[#EFECEA] animate-shimmer" />
        )}

        {/* Product Image */}
        <Image
          src={product.images[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-[1.08]' : 'scale-100'
          } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Gradient overlay — always present, deepens on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-400 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges — top left */}
        <div className={`absolute top-3 z-10 flex flex-col gap-1.5 ${isRTL ? 'right-3' : 'left-3'}`}>
          {product.discount && product.discount > 0 && (
            <span className="px-2.5 py-0.5 bg-[#C9A84C] text-white text-[10px] font-bold tracking-widest uppercase">
              −{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 bg-[#2D1F1F] text-[#E8D5A3] text-[10px] font-bold tracking-widest uppercase">
              New
            </span>
          )}
          {product.isBestseller && !product.isNew && !product.discount && (
            <span className="px-2.5 py-0.5 bg-white/90 text-[#2D1F1F] text-[10px] font-bold tracking-widest uppercase border border-[#2D1F1F]/15">
              Best
            </span>
          )}
        </div>

        {/* Wishlist Button — top right, always visible */}
        <motion.button
          onClick={handleToggleWishlist}
          className={`absolute top-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isRTL ? 'left-3' : 'right-3'
          } ${
            inWishlist
              ? 'bg-[#C9A84C] text-white shadow-lg shadow-[#C9A84C]/40'
              : 'bg-white/80 backdrop-blur-sm text-[#2D1F1F] hover:bg-[#C9A84C] hover:text-white'
          }`}
          whileTap={{ scale: 0.85 }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* CTA Bar — slides up from bottom on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-x-0 bottom-0 z-10 p-3 flex gap-2"
            >
              {/* Add to Bag */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 h-10 text-[11px] font-bold tracking-widest uppercase transition-colors ${
                  inCart
                    ? 'bg-[#2D1F1F] text-[#C9A84C]'
                    : 'bg-[#C9A84C] text-white hover:bg-[#b8943f]'
                } disabled:opacity-50`}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingBag size={13} />
                {inCart ? (language === 'ar' ? 'في الحقيبة' : 'In Bag') : (language === 'ar' ? 'أضف للحقيبة' : 'Add to Bag')}
              </motion.button>

              {/* Quick View */}
              {onQuickView && (
                <motion.button
                  onClick={handleQuickView}
                  className="w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  whileTap={{ scale: 0.92 }}
                  title="Quick View"
                >
                  <Eye size={14} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 z-20 bg-white/55 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-5 py-1.5 bg-[#2D1F1F] text-white text-xs font-bold tracking-widest uppercase">
              {language === 'ar' ? 'نفد المخزون' : 'Sold Out'}
            </span>
          </div>
        )}
      </Link>

      {/* ── Info Panel ── */}
      <div className={`pt-4 pb-2 flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Brand — links to the brand's filtered listing */}
        <Link
          href={`/products?brand=${brandSlug}`}
          className="text-[10px] font-black tracking-[0.28em] uppercase text-[#C9A84C] truncate leading-none hover:text-[#2D1F1F] transition-colors w-fit"
        >
          {brand}
        </Link>

        {/* Name */}
        <Link href={`/products/${product.id}`} onClick={() => addToRecentlyViewed(product)}>
          <h3 className="text-sm font-medium text-[#2D1F1F] leading-snug line-clamp-2 hover:text-[#C9A84C] transition-colors duration-200 mt-0.5">
            {name}
          </h3>
        </Link>

        {/* Stars */}
        <div className={`flex items-center gap-1.5 mt-0.5 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={9}
                className={
                  i < Math.floor(product.rating)
                    ? 'text-[#C9A84C] fill-[#C9A84C]'
                    : 'text-gray-200 fill-gray-200'
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 leading-none">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className={`flex items-baseline gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-[15px] font-bold text-[#2D1F1F] tracking-tight">
            {language === 'ar'
              ? `${product.price.toFixed(3)} ر.ع.`
              : `OMR ${product.price.toFixed(3)}`}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through font-normal">
              {language === 'ar'
                ? `${product.originalPrice.toFixed(3)} ر.ع.`
                : `OMR ${product.originalPrice.toFixed(3)}`}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line (animates on hover) */}
      <motion.div
        className="h-[1.5px] bg-[#C9A84C] origin-left"
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      />
    </motion.article>
  );
}
