'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, Tag, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { getFeaturedProducts } from '@/data/products';

const cx = 'max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { showToast } = useApp();
  const { language, t, isRTL } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);

  const discount = appliedPromo ? subtotal * 0.15 : 0;
  const shipping = subtotal > 10 ? 0 : 2.0;
  const tax = subtotal * 0.05;
  const total = subtotal - discount + shipping + tax;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'RAF15') {
      setAppliedPromo(true);
      showToast('Promo code applied! 15% off', 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="border-b border-[#2D1F1F]/8 bg-white">
          <div className={`${cx} py-10 sm:py-14`}>
            <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
              {language === 'en' ? 'Shopping Bag' : 'حقيبة التسوق'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.cart.title}</h1>
          </div>
        </div>
        <div className={`${cx} py-32 text-center`}>
          <ShoppingBag size={48} strokeWidth={1} className="text-[#2D1F1F]/15 mx-auto mb-8" />
          <h2 className="text-2xl font-serif text-[#2D1F1F] mb-3">{t.cart.empty}</h2>
          <p className="text-[#2D1F1F]/45 text-sm mb-10 max-w-xs mx-auto leading-relaxed">{t.cart.emptyDesc}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-[#2D1F1F] text-white px-10 py-3.5 text-[11px] font-black tracking-[0.25em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors duration-300"
          >
            {t.cart.continueShopping}
            <ArrowRight size={14} className={isRTL ? 'rtl-flip' : ''} />
          </Link>
        </div>
        <div className={`${cx} pb-20`}>
          <FeaturedProducts products={getFeaturedProducts().slice(0, 5)} label={language === 'en' ? 'You Might Like' : 'قد يعجبك'} title={language === 'en' ? 'Recommended' : 'موصى به'} />
        </div>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[#2D1F1F]/8 bg-white">
        <div className={`${cx} py-10 sm:py-14`}>
          <span className="block text-[10px] font-black tracking-[0.4em] uppercase text-[#C9A84C] mb-3">
            {language === 'en' ? 'Shopping Bag' : 'حقيبة التسوق'}
          </span>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2D1F1F]">{t.cart.title}</h1>
            <p className="text-[#2D1F1F]/40 text-sm pb-1">
              {items.reduce((s, i) => s + i.quantity, 0)} {language === 'en' ? 'items' : 'عناصر'}
            </p>
          </div>
        </div>
      </div>

      <div className={`${cx} py-10 sm:py-14`}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
          {/* Cart items */}
          <div>
            <div className="border-t border-[#2D1F1F]/8">
              <AnimatePresence>
                {items.map(item => {
                  const name = language === 'ar' ? item.product.nameAr : item.product.name;
                  const brand = language === 'ar' ? item.product.brandAr : item.product.brand;
                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      className={`flex gap-5 py-6 border-b border-[#2D1F1F]/8 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Image */}
                      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                        <div className="relative w-24 h-28 sm:w-28 sm:h-32 overflow-hidden bg-[#F5F3EF] rounded-md">
                          <Image
                            src={item.product.images[0]}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#C9A84C] mb-1">{brand}</p>
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="text-sm sm:text-base font-medium text-[#2D1F1F] leading-snug hover:text-[#C9A84C] transition-colors line-clamp-2">
                            {name}
                          </h3>
                        </Link>
                        {item.selectedColor && (
                          <p className="text-xs text-[#2D1F1F]/45 mt-1">{language === 'en' ? 'Color' : 'اللون'}: {item.selectedColor}</p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-[#2D1F1F]/45">{language === 'en' ? 'Size' : 'المقاس'}: {item.selectedSize}</p>
                        )}

                        <div className={`flex items-center justify-between mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {/* Quantity controls */}
                          <div className={`flex items-center border border-[#2D1F1F]/15 rounded-md overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-9 h-9 flex items-center justify-center text-[#2D1F1F]/60 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-[#2D1F1F] border-x border-[#2D1F1F]/15 h-9 flex items-center justify-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-9 h-9 flex items-center justify-center text-[#2D1F1F]/60 hover:text-[#2D1F1F] hover:bg-[#2D1F1F]/5 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="text-base font-bold text-[#2D1F1F]">
                              {language === 'ar'
                                ? `${(item.product.price * item.quantity).toFixed(3)} ر.ع.`
                                : `OMR ${(item.product.price * item.quantity).toFixed(3)}`}
                            </span>
                            <button
                              onClick={() => { removeFromCart(item.product.id); showToast(t.common.itemRemoved); }}
                              className="text-[#2D1F1F]/25 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="pt-5">
              <button
                onClick={() => { clearCart(); showToast('Cart cleared'); }}
                className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#2D1F1F]/30 hover:text-red-400 transition-colors"
              >
                {language === 'en' ? 'Clear Cart' : 'مسح السلة'}
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div>
            {/* Promo code */}
            <div className="border border-[#2D1F1F]/8 rounded-xl p-6 mb-5">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-4 flex items-center gap-2">
                <Tag size={11} className="text-[#C9A84C]" />
                {t.cart.promo}
              </h3>
              <div className="flex gap-0">
                {/*
                  Promo input + Apply button as a flush group. This form does NOT
                  use `flex-row-reverse`, so the visual order naturally flips with
                  `dir`. Logical sides therefore line up correctly: `border-e-0`
                  removes the seam-side border, and `rounded-s-*` / `rounded-e-*`
                  round the outer corners in both languages.
                */}
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="RAF15"
                  disabled={appliedPromo}
                  className={`flex-1 h-10 px-4 border border-[#2D1F1F]/15 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#C9A84C] transition-colors text-[#2D1F1F] placeholder-[#2D1F1F]/25 border-e-0 rounded-s-md ${
                    appliedPromo ? 'text-[#C9A84C]' : ''
                  }`}
                />
                <button
                  onClick={applyPromo}
                  disabled={appliedPromo || !promoCode}
                  className="h-10 px-5 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.15em] uppercase rounded-e-md hover:bg-[#C9A84C] transition-colors disabled:opacity-40"
                >
                  {t.cart.apply}
                </button>
              </div>
              {appliedPromo && (
                <p className="text-xs text-[#C9A84C] mt-2 font-medium">
                  ✓ {language === 'en' ? '15% discount applied' : 'تم تطبيق خصم 15%'}
                </p>
              )}
            </div>

            {/* Summary card */}
            <div className="border border-[#2D1F1F]/8 rounded-xl p-6 sticky top-24">
              <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#2D1F1F]/50 mb-6">
                {t.cart.orderSummary}
              </h3>

              <div className="space-y-3.5 mb-6">
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/55">{t.cart.subtotal}</span>
                  <span className="font-medium text-[#2D1F1F]">OMR {subtotal.toFixed(3)}</span>
                </div>
                {appliedPromo && (
                  <div className={`flex justify-between text-sm text-[#C9A84C] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{language === 'en' ? 'Discount (RAF15)' : 'خصم (RAF15)'}</span>
                    <span>−OMR {discount.toFixed(3)}</span>
                  </div>
                )}
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/55">{t.cart.shipping}</span>
                  <span className={`font-medium ${shipping === 0 ? 'text-[#C9A84C]' : 'text-[#2D1F1F]'}`}>
                    {shipping === 0 ? t.cart.freeShipping : `OMR ${shipping.toFixed(3)}`}
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#2D1F1F]/55">{t.cart.tax} (5%)</span>
                  <span className="font-medium text-[#2D1F1F]">OMR {tax.toFixed(3)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-[11px] text-[#C9A84C] bg-[#C9A84C]/8 px-3 py-2 text-center rounded-md">
                    {t.cart.shippingNote}
                  </p>
                )}
              </div>

              <div className="border-t border-[#2D1F1F]/8 pt-5 mb-6">
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-bold text-[#2D1F1F] tracking-wide uppercase">{t.cart.total}</span>
                  <span className="text-xl font-bold text-[#C9A84C]">OMR {total.toFixed(3)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex w-full h-13 items-center justify-center gap-3 bg-[#2D1F1F] text-white text-[11px] font-black tracking-[0.25em] uppercase rounded-md hover:bg-[#C9A84C] transition-colors duration-300"
                style={{ height: 52 }}
              >
                {t.cart.checkout}
                <ArrowRight size={14} className={isRTL ? 'rtl-flip' : ''} />
              </Link>

              <Link
                href="/products"
                className="block text-center text-[11px] font-bold tracking-[0.15em] uppercase text-[#2D1F1F]/35 hover:text-[#C9A84C] mt-4 transition-colors"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
